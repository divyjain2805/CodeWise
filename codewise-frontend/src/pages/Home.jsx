import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

function Home() {
    const [problem, setProblem] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHomeData() {
            try {
                const [problemRes, statsRes] = await Promise.allSettled([
                    api.get("/prob/problem-of-the-day"),
                    api.get("/admin/platform-stats"),
                ]);

                if (problemRes.status === "fulfilled" && problemRes.value.data.success) {
                    setProblem(problemRes.value.data.problem);
                }
                
                if (statsRes.status === "fulfilled") {
                    setStats(statsRes.value.data);
                }
                
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchHomeData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-16">

            {/* Hero Section */}
            <section className="hero min-h-[70vh] bg-gradient-to-br from-base-200 via-base-100 to-base-300 rounded-3xl shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="hero-content text-center relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-7xl font-extrabold tracking-tight mb-4">
                            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">Coding Interviews</span>
                        </h1>
                        <p className="py-6 text-xl opacity-80 font-medium">
                            Practice coding problems, improve problem-solving skills, and prepare for top product-based companies.
                        </p>
                        <div className="flex justify-center gap-6 mt-4">
                            <Link to="/problems" className="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-primary/40 hover:scale-105 transition-transform">
                                Start Solving
                            </Link>
                            <Link to="/problems" className="btn btn-outline btn-lg rounded-full px-8 hover:scale-105 transition-transform">
                                Explore Problems
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem of the Day */}
            <section className="mt-12">
                <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-600"> 
                    🔥 Problem of the Day 
                </h2>
                {problem ? (
                    <div className="card glass max-w-4xl mx-auto shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="card-body">
                            <h2 className="card-title text-3xl font-bold">{problem.title}</h2>
                            <p className="opacity-80 text-lg mt-2 line-clamp-3">{problem.description}</p>
                            <div className="mt-6 flex justify-between items-center">
                                <div className={`badge badge-lg ${problem.difficulty === 'Easy' ? 'badge-success' : problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'}`}>
                                    {problem.difficulty}
                                </div>
                                <Link to={`/problems/${problem.slug}`} className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/30">
                                    Solve Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-50">No Problem of the Day available.</div>
                )}
            </section>

            {/* Platform Stats */}
            <section className="mt-16 mb-12">
                <h2 className="text-4xl font-bold mb-8 text-center">Platform Statistics</h2>
                <div className="stats shadow-xl w-full bg-base-100/60 backdrop-blur-lg border border-base-200 rounded-2xl divide-x divide-base-200">
                    <div className="stat place-items-center hover:bg-base-200/50 transition-colors duration-300 cursor-default">
                        <div className="stat-title font-medium text-lg">Problems</div>
                        <div className="stat-value text-primary text-5xl my-2">{stats?.totalProblems || 0}</div>
                        <div className="stat-desc">Active challenges</div>
                    </div>

                    <div className="stat place-items-center hover:bg-base-200/50 transition-colors duration-300 cursor-default">
                        <div className="stat-title font-medium text-lg">Users</div>
                        <div className="stat-value text-secondary text-5xl my-2">{stats?.totalUsers || 0}</div>
                        <div className="stat-desc">Registered coders</div>
                    </div>

                    <div className="stat place-items-center hover:bg-base-200/50 transition-colors duration-300 cursor-default">
                        <div className="stat-title font-medium text-lg">Submissions</div>
                        <div className="stat-value text-accent text-5xl my-2">{stats?.totalSubmissions || 0}</div>
                        <div className="stat-desc">Code executed</div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Home;