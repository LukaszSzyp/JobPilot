import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, CheckCircle, Target } from "lucide-react"
import type { JobApplicationStats } from "@/types"

interface StatsCardsServerProps {
  stats: JobApplicationStats
}

export function StatsCardsServer({ stats }: StatsCardsServerProps) {
  const cards = [
    {
      title: "Łączna liczba aplikacji",
      value: stats.total,
      subtitle: `${stats.applied} oczekujących na odpowiedź`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Rozmowy kwalifikacyjne",
      value: stats.interview,
      subtitle: `${stats.total > 0 ? Math.round((stats.interview / stats.total) * 100) : 0}% wszystkich aplikacji`,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-100",
      iconBg: "bg-amber-500",
    },
    {
      title: "Otrzymane oferty",
      value: stats.offer,
      subtitle: `${stats.successRate}% wskaźnik sukcesu`,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-100",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Wskaźnik odpowiedzi",
      value: `${stats.responseRate}%`,
      subtitle: `${stats.rejected} odrzuconych aplikacji`,
      icon: Target,
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-100",
      iconBg: "bg-purple-500",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${card.bgGradient} border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{card.title}</CardTitle>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${card.iconBg} shadow-md`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
              {card.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
