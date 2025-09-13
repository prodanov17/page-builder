import { useMemo } from "react";
import { Loader2, Check, Save as SaveIcon } from "lucide-react";
import type { SaveStatus } from "@/hooks/useAutoSave";

export interface SaveStatusBarProps {
    saveStatus: SaveStatus;
    lastSavedAt?: string | number | Date | null; // optional timestamp
    className?: string;
    showTimestamp?: boolean; // whether to render "Saved 2m ago"
    // optional retry handler if you want a retry button when idle (not used by default)
    onRetry?: () => void;
}

const timeAgo = (ts?: string | number | Date | null) => {
    if (!ts) return "";
    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) return "";
    const sec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (sec < 5) return "just now";
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;
    const day = Math.floor(hr / 24);
    return `${day}d`;
};

export default function SaveStatusBar({
    saveStatus,
    lastSavedAt,
    className = "",
    showTimestamp = true,
}: SaveStatusBarProps) {
    const timestamp = useMemo(() => timeAgo(lastSavedAt), [lastSavedAt]);

    return (
        <div
            className={`flex items-center gap-2 text-sm leading-none p-2 rounded-md ${className}`}
            aria-live="polite"
            aria-atomic="true"
        >
            {/* Icon */}
            <div className="flex items-center gap-2">
                {saveStatus === "waiting" && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" aria-hidden />
                )}

                {saveStatus === "saved" && (
                    <Check className="w-4 h-4 text-green-600" aria-hidden />
                )}

                {saveStatus === "idle" && (
                    <SaveIcon className="w-4 h-4 text-slate-400" aria-hidden />
                )}
            </div>

            {/* Text */}
            <div className="flex flex-col">
                {saveStatus === "waiting" && (
                    <div className="text-blue-600 font-medium">Saving...</div>
                )}

                {saveStatus === "saved" && (
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700">Saved</span>
                        {showTimestamp && timestamp && (
                            <span className="text-xs text-slate-400">{timestamp} ago</span>
                        )}
                    </div>
                )}

                {saveStatus === "idle" && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <span>All changes saved</span>
                        {showTimestamp && timestamp && (
                            <span className="text-xs text-slate-400">last saved {timestamp} ago</span>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
