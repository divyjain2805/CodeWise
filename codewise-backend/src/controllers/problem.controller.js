const problemmodel = require("../models/problem.model");
const submissionmodel = require("../models/submission.model");

const cloudinary = require("../config/cloudinary");

const { redisclient } = require("../db/redis");



async function createproblem(req, res) {

  try {

    const { title, description, difficulty } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const slug = title.toLowerCase().trim().replace(/\s+/g, "-");

    const existingproblem = await problemmodel.findOne({ slug });

    if (existingproblem) { return res.status(409).json({ success: false, message: "Problem already exists" }); }

    // Parse JSON fields from form-data
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const examples = req.body.examples ? JSON.parse(req.body.examples) : [];
    const constraints = req.body.constraints ? JSON.parse(req.body.constraints) : [];
    const hints = req.body.hints ? JSON.parse(req.body.hints) : [];
    const visibletestcases = req.body.visibletestcases ? JSON.parse(req.body.visibletestcases) : [];
    const hiddentestcases = req.body.hiddentestcases ? JSON.parse(req.body.hiddentestcases) : [];
    const startercode = req.body.starterCode ? JSON.parse(req.body.starterCode) : {};
    const referencesolution = req.body.referenceSolution ? JSON.parse(req.body.referenceSolution) : {};


    // Default video solution object
    let videosolution = { videoUrl: "", thumbnailUrl: "" };

    // If video uploaded
    if (req.file) {
      const thumbnailurl = cloudinary.url(req.file.filename, {
        resource_type: "video",
        format: "jpg",
      });

      videosolution = {
        videoUrl: req.file.path,
        thumbnailUrl: thumbnailurl,
        duration: 0,
      };
    }

    const problem = await problemmodel.create({
      title, slug, description, difficulty, tags, examples, constraints, hints,
      visibletestcases, hiddentestcases, starterCode: startercode,
      referenceSolution: referencesolution, videoSolution: videosolution,
      createdby: req.user.id,
    });

    // redis for delete previous data/ out-dated data 
    // await redisclient.del("allproblems");

    // Clear all cached problem lists
    const keys = await redisclient.keys("problems:*");
    if (keys.length > 0) { await redisclient.del(keys); }

    res.status(201).json({
      success: true, message: "new problem created", problem: problem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function getproblems(req, res) {
  try {
    const { page = 1, limit = 10, difficulty, tag,
      search, sort = "newest" } = req.query;

    const currentpage = Number(page);
    const pagelimit = Number(limit);

    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: "i" };

    const sortoption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // 🔑 Dynamic cache key
    const cacheKey = `problems:${page}:${limit}:${difficulty || ""}:${tag || ""}:${search || ""}:${sort}`;

    let response;
    const cached = await redisclient.get(cacheKey);
    if (cached) {
      console.log("Data from Redis");
      response = JSON.parse(cached);
    } else {
      const totalproblems = await problemmodel.countDocuments(filter);
      const problems = await problemmodel
        .find(filter)
        .sort(sortoption)
        .skip((currentpage - 1) * pagelimit)
        .limit(pagelimit);

      response = {
        success: true,
        totalproblems,
        currentpage,
        totalpages: Math.ceil(totalproblems / pagelimit),
        problems: problems
      };

      await redisclient.set(cacheKey, JSON.stringify(response), { EX: 3600 });
      console.log("Data from MongoDB");
    }

    if (req.user) {
      const solved = req.user.solvedproblems.map(id => id.toString());
      const attempted = await submissionmodel
        .find({ user: req.user.id })
        .distinct("problem");

      const attemptedset = new Set(
        attempted.map(id => id.toString())
      );

      response.problems = response.problems.map(problem => {
        let status = "Not Attempted";
        if (attemptedset.has(problem._id.toString())) { status = "Attempted"; }
        if (solved.includes(problem._id.toString())) { status = "Solved"; }
        
        const obj = typeof problem.toObject === 'function' ? problem.toObject() : problem;
        return { ...obj, status };
      });
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateproblem(req, res) {
  try {
    const updated = await problemmodel.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // when data update , so clear outdated data from redis
    // await redisclient.del("allproblems");

    // Clear all cached problem lists
    const keys = await redisclient.keys("problems:*");

    if (keys.length > 0) { await redisclient.del(keys); }

    res.json({ success:true, message: "Problem updated successfully", updated });
  } catch (error) {
    res.status(500).json({success:false, message: "Internal server error" });
  }

}

async function deleteproblem(req, res) {
  try {
    const deleted = await problemmodel.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }

    //  also delete from redis cuz of outdated data
    // await redisclient.del("allproblems");

    // Clear all cached problem lists
    const keys = await redisclient.keys("problems:*");
    if (keys.length > 0) { await redisclient.del(keys); }

    res.json({ message: "Problem deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getproblembyslug(req, res) {
  try {
    const problem = await problemmodel.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}


async function getproblemoftheday(req, res) {

    try {

        const total = await problemmodel.countDocuments();  // total count of problems

        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No problems available"
            });
        }

        const today = new Date();

        const start = new Date(today.getFullYear(), 0, 0);

        const diff = today - start;

        const day = Math.floor(diff / (1000 * 60 * 60 * 24));

        const index = day % total;
        // console.log(index,diff,day,today,start);

        const problem = await problemmodel
            .findOne()
            .skip(index);

        return res.status(200).json({
            success: true,
            // problem:{title:problem.title, difficulty:problem.difficulty }
            problem
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

// testing 


// async function createproblem(req, res) {
//   try {
//     console.log("Body:", req.body);
//     console.log("File:", req.file);

//     return res.status(200).json({
//       success: true,
//       body: req.body,
//       file: req.file,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }


// async function getproblems(req, res) {
//   try {

//     await redisclient.del("allproblems");  this for testing data

//     // 1. Check cache
//     const cachedproblems = await redisclient.get("allproblems");

//     if (cachedproblems) {
//       console.log("Data from Redis");

//       return res.status(200).json(JSON.parse(cachedproblems));
//     }

//     // 2. Fetch from MongoDB
//     const problems = await problemmodel.find();

//     // 3. Save to Redis (expires after 1 hour)
//     await redisclient.set(
//       "allproblems",
//       JSON.stringify(problems),
//       {
//         EX: 3600,
//       }
//     );

//     console.log("Data from MongoDB");

//     return res.status(200).json(problems);

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// }

// async function createproblem(req, res) {

//   try {

//     // const { title, description, difficulty, /*tags, examples, constraints, hints,
//     // visibletestcases, hiddentestcases, startercode, referencesolution,videoSolution, slug*/ } = req.body;

//     const { title, description, difficulty } = req.body;
//     // console.log(req.body)

//     if (!title || !description || !difficulty) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const slug = title.toLowerCase().trim().replace(/\s+/g, "-");

//     const existingproblem = await problemmodel.findOne({ slug });

//     if (existingproblem) { return res.status(409).json({ success: false, message: "Problem already exists" }); }

//     // Parse JSON fields from form-data
//     const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
//     const examples = req.body.examples ? JSON.parse(req.body.examples) : [];
//     const constraints = req.body.constraints ? JSON.parse(req.body.constraints) : [];
//     const hints = req.body.hints ? JSON.parse(req.body.hints) : [];
//     const visibletestcases = req.body.visibletestcases ? JSON.parse(req.body.visibletestcases) : [];
//     const hiddentestcases = req.body.hiddentestcases ? JSON.parse(req.body.hiddentestcases) : [];
//     const startercode = req.body.startercode ? JSON.parse(req.body.startercode) : {};
//     const referencesolution = req.body.referencesolution ? JSON.parse(req.body.referencesolution) : {};


//     // Default video solution object
//     let videosolution = { videoUrl: "", thumbnailUrl: "", duration: 0 };

//     // If video uploaded
//     if (req.file) {
//       const thumbnailurl = cloudinary.url(req.file.filename, {
//         resource_type: "video",
//         format: "jpg",
//       });

//       videosolution = {
//         videoUrl: req.file.path,
//         thumbnailUrl: thumbnailurl,
//         duration: 0,
//       };
//     }

//     const problem = await problemmodel.create({
//       title, slug, description, difficulty, tags, examples, constraints, hints,
//       visibletestcases, hiddentestcases, startercode: startercode,
//       referencesolution: referencesolution, videoSolution: videosolution,
//       createdby: req.user.id,
//     });

//     // redis for delete previous data/ out-dated data 
//     await redisclient.del("allproblems");

//     res.status(201).json({
//       success: true, message: "new problem created", problem: problem
//       //       , body: req.body,
//       //         file: req.file,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }


// async function getproblems(req, res) {

//   try {

//     const cachedproblems = await redisclient.get("allproblems")

//     if (cachedproblems) {
//       console.log("data from redis")
//       return res.status(200).json(JSON.parse(cachedproblems))
//     }

//     const problems = await problemmodel.find();
//     // console.log(problems)

//     await redisclient.set("allproblems", JSON.stringify(problems));
//     console.log("data from mongo")

//     return res.status(200).json({ success: true, total: problems.length, problems });

//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }

// }


module.exports = { createproblem, getproblems, updateproblem,
   deleteproblem, getproblembyslug, getproblemoftheday }