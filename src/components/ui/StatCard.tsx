export function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 text-blue-600",
    green: "from-green-50 to-green-100 text-green-600",
    purple: "from-purple-50 to-purple-100 text-purple-600",
    red: "from-red-50 to-red-100 text-red-600",
    yellow: "from-yellow-50 to-yellow-100 text-yellow-600",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-600",
    pink: "from-pink-50 to-pink-100 text-pink-600",
  };

  return (
    <div
      className={`bg-gradient-to-br ${
        colorClasses[color as keyof typeof colorClasses]
      } p-4 rounded-lg`}
    >
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div
        className={`text-2xl font-bold ${
          colorClasses[color as keyof typeof colorClasses].split(" ")[1]
        }`}
      >
        {value}
      </div>
    </div>
  );
}
