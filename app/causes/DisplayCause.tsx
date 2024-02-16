import Total from "../Total";

export default function DisplayCause({
    cause,
    schedules,
}: {
    cause: string;
    schedules: [IDBValidKey, ISchedule][];
}) {
    return (
        <div className="ml-8 my-6">
            <h2 className="text-3xl font-bold capitalize">{cause}</h2>
            <table className="w-full border-collapse border border-[#444] text-[1.3rem] max-[700px]:text-base max-[500px]:text-xs my-4">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Cause</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(([key, value]) => {
                        return (
                            <tr key={key as string}>
                                <td className="w-1/2">
                                    {new Date(value.time).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        }
                                    )}
                                </td>
                                <td className="w-1/2">
                                    {value.amount}
                                    <span className="ml-2">৳</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Total>
                {schedules.reduce((prev, curr) => {
                    return prev + curr[1].amount;
                }, 0)}
            </Total>
        </div>
    );
}
