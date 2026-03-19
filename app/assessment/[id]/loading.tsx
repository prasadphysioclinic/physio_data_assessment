import { HighSpeedLoader } from "@/components/skeletons";

export default function Loading() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <HighSpeedLoader />
        </div>
    );
}
