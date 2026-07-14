const problemmodel = require("../models/problem.model");
const submissionmodel = require("../models/submission.model");
const { executecode } = require("./jdoodle.service");
const languagemap = require("../utils/languagemap.util");
const { updateuserstats } = require("../services/user.service")

// done
async function submitproblem(req) {

    try {
        const { language, code } = req.body;

// types of user fault:- lang-code, islangexist, ispropblemexist
  /*1 */   if (!language || !code) {
            return { success: false, message: "Language and code are required" };
        }

        const config = languagemap[language];

 /*2 */       if (!config) { return { success: false, message: "Unsupported language" }; }


        const problem = await problemmodel.findOne({ slug: req.params.slug });

 /*3 */       if (!problem) {
            return { success: false, message: "Problem not found" };
        }

// types of code error :- runtimerror, compilererror,wrong answer
        const testcases = problem.hiddentestcases;

        let runtime = "";
        let memory = "";

        for (const testcase of testcases) {
            // console.log(testcase.input); 
            const result = await executecode(
                code,
                config.language,
                config.versionIndex,
                testcase.input
            );

               // code compiler but crash :- divide by zero, segmentation fault
/*1 */         if (result.error) {

                await submissionmodel.create({
                    user: req.user.id, problem: problem._id, language,
                    code, status: "Runtime Error", runtime, memory
                });

                await updateuserstats(req.user.id, problem, "Runtime Error");

                return { success: true, verdict: "Runtime Error", error: result.error };
            }

            runtime = result.cpuTime;
            memory = result.memory;

            // console.log(result);

            // Compilation Error
/*2 */         if (result.statusCode != 200) {

                await submissionmodel.create({
                    user: req.user.id, problem: problem._id, language, code,
                    status: "Compilation Error", runtime: "", memory: ""
                });

                await updateuserstats(req.user.id, problem, "Compilation Error");

                return { success: true, verdict: "Compilation Error", error: result.error || "Compilation Failed" };
            }

            const output = result.output.replace(/\r/g, "").trim();
            const expected = testcase.expectedOutput.replace(/\r/g, "").trim();

            // output not match
/*3 */         if (output !== expected) {

                await submissionmodel.create({
                    user: req.user.id, problem: problem._id, language,
                    code, status: "Wrong Answer", runtime, memory
                });
                await updateuserstats(req.user.id, problem, "Wrong Answer");

                return { success: true, verdict: "Wrong Answer", input: testcase.input, expected: expected, output: output };
            }

        }
        // answer accepted
        await submissionmodel.create({
            user: req.user.id, problem: problem._id, language,
            code, status: "Accepted", runtime, memory
        });

        await updateuserstats(req.user.id, problem, "Accepted");

        return { success: true, verdict: "Accepted", message: "Accepted" }



    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal Server Error" };
    }
}

async function testproblem(req) {
    try {
        const { language, code } = req.body;
        if (!language || !code) {
            return { success: false, message: "Language and code are required" };
        }
        const config = languagemap[language];
        if (!config) { return { success: false, message: "Unsupported language" }; }
        const problem = await problemmodel.findOne({ slug: req.params.slug });
        if (!problem) {
            return { success: false, message: "Problem not found" };
        }

        const testcases = problem.visibletestcases || [];
        if (testcases.length === 0) {
            return { success: true, verdict: "No Visible Testcases", message: "No visible testcases to run against." };
        }

        let runtime = "";
        let memory = "";
        for (const testcase of testcases) {
            const result = await executecode(
                code,
                config.language,
                config.versionIndex,
                testcase.input
            );
            if (result.error) {
                return { success: true, verdict: "Runtime Error", error: result.error };
            }
            runtime = result.cpuTime;
            memory = result.memory;
            if (result.statusCode != 200) {
                return { success: true, verdict: "Compilation Error", error: result.error || "Compilation Failed" };
            }
            const output = result.output.replace(/\r/g, "").trim();
            const expected = testcase.expectedOutput.replace(/\r/g, "").trim();
            if (output !== expected) {
                return { success: true, verdict: "Wrong Answer", input: testcase.input, expected: expected, output: output };
            }
        }
        return { success: true, verdict: "Accepted", message: "All visible testcases passed!" }
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal Server Error" };
    }
}

// done
async function getmysubmissionsservice(req) {

    try {

        const submissions = await submissionmodel
            .find({ user: req.user.id })
            .populate("problem", "title slug difficulty -_id")
            .sort({ createdAt: -1 });

        return {
            success: true,
            count: submissions.length,
            submissions
        };

    } catch (err) {

        console.log(err);

        return {
            success: false,
            message: "Internal Server Error"
        };

    }

}

// done
async function getproblemsubmissionsservice(req) {

    try {

        const problem = await problemmodel.findOne({
            slug: req.params.slug
        });

        if (!problem) {
            return { success: false, message: "Problem not found" };
        }

        const submissions = await submissionmodel
            .find({ 
                user: req.user.id,  // only fetch currently logged-in user id 
                problem: problem._id  // fetch only this id submission
            })
            .sort({ createdAt: -1 });

        return {
            success: true,
            count: submissions.length,
            problem: {
                title: problem.title,
                slug: problem.slug
            },
            submissions
        };

    } catch (error) {

        console.log(error);

        return {
            success: false,
            message: "Internal Server Error"
        };

    }

}

// done
async function getsubmissionbyidservice(req) {

    try {

        const submission = await submissionmodel
            .findOne({
                _id: req.params.id,
                user: req.user.id
            })
            .populate("problem", "title slug difficulty -_id");

        if (!submission) {
            return {
                success: false,
                message: "Submission not found"
            };
        }

        return {
            success: true,
            // submission:submission.problem
            submission
        };

    } catch (error) {

        console.log(error);

        return {
            success: false,
            message: "Internal Server Error"
        };

    }

}

module.exports = {
    submitproblem, testproblem, getmysubmissionsservice, getproblemsubmissionsservice, getsubmissionbyidservice
};