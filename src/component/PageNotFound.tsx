// components/PageNotFound/PageNotFound.tsx
import { AlertTriangle, ArrowLeft, Frown, Ghost, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";



const PageNotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };


    // Get current path for display
    const currentPath = location.pathname;

    return (
        <div className="min-h-screen bg-linear-to-b from-background via-background to-primary/10 flex items-center justify-center p-4">
            <div className="max-w-2xl text-center">
                {/* Animated 404 */}
                <div className="relative mb-10">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        {[4, 0, 4].map((num, index) => (
                            <div
                                key={index}
                                className="relative w-24 h-32 bg-linear-to-b from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl flex items-center justify-center animate-pulse"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <span className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-b from-primary to-primary-dark">
                                    {num}
                                </span>
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-error rounded-full animate-bounce"></div>
                                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-info rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        ))}
                    </div>

                    {/* Ghost animation */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="animate-float">
                            <Ghost className="w-12 h-12 text-primary/30" />
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-4 animate-fadeIn">
                    Oops! Lost in Space?
                </h2>

                <div className="bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 animate-slideUp">
                    <Frown className="w-12 h-12 text-warning mx-auto mb-4" />
                    <p className="text-muted text-lg mb-4">
                        The page <code className="bg-background px-2 py-1 rounded text-foreground font-medium">{currentPath}</code> seems to have drifted off into the digital void.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted">
                        <AlertTriangle className="w-4 h-4" />
                        <span>HTTP 404 • Not Found</span>
                    </div>
                </div>

                <div className="space-y-4 animate-slideUp" style={{ animationDelay: "200ms" }}>
                    <div className="flex flex-wrap gap-3 justify-center">

                        <button
                            onClick={handleGoBack}
                            className="group px-6 py-3 border border-border text-foreground rounded-xl hover:bg-surface transition-all hover:border-primary/30 flex items-center gap-2 hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>


                        <Link
                            to="/"
                            className="group px-6 py-3 bg-linear-to-r from-primary to-primary-dark text-white rounded-xl hover:from-primary-dark hover:to-primary transition-all hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Go Home
                        </Link>



                    </div>

                    <div className="text-sm text-muted pt-4 border-t border-border/30">
                        <p>If you believe this is an error, please contact support.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;