type ProgressBarProps = {
    percent: number;
};

export function ProgressBar({ percent }: ProgressBarProps) {
    return (
        <div className="scale-block">
             <div className="scale"
                style={{
                width: `${Math.min(100, percent)}%`,
             }}
             />
        </div>
    )
}