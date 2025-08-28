"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function HealthCheckAlert() {
    const [status, setStatus] = useState<"ok" | "down" | "loading">("loading");

    useEffect(() => {
        const checkHealth = () => {
            fetch("/health")
                .then((res) => {
                    if (res.ok) return res.json();
                    throw new Error("Server down");
                })
                .then((data) => {
                    if (data?.status === "ok") setStatus("ok");
                    else setStatus("down");
                })
                .catch(() => setStatus("down"));
        };

        checkHealth();
        const interval = setInterval(checkHealth, 10000);

        return () => clearInterval(interval);
    }, []);

    if (status === "loading") return null;

    return (
        <div className="mt-6">
            {status === "ok" ? (
                <Alert className="border-green-600 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Backend Healthy</AlertTitle>
                    <AlertDescription>
                        Everything is running smoothly.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Backend Down</AlertTitle>
                    <AlertDescription>
                        Unable to reach the server. Please wait till the connection is restored.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
