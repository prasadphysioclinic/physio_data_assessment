import { HighSpeedLoader } from "@/components/skeletons";

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <HighSpeedLoader />
        </div>
    );
}
