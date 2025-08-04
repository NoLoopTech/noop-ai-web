import Payments from "./partials/Payments"
import Sales from "./partials/Sales"
import Stats from "./partials/Stats"
import Subscription from "./partials/Subscriptions"
import TeamMembers from "./partials/TeamMembers"
import TotalRevenue from "./partials/TotalRevenue"

export default function Overview() {
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-5 md:grid-cols-6 lg:grid-cols-9">
      <Stats />
      <div className="col-span-3">
        <TotalRevenue />
      </div>

      <div className="col-span-3 md:col-span-6">
        <Sales />
      </div>
      <div className="col-span-3 md:col-span-6 lg:col-span-3">
        <Subscription />
      </div>
      <div className="col-span-3 md:col-span-6 lg:col-span-5 xl:col-span-6">
        <Payments />
      </div>
      <div className="col-span-3 md:col-span-6 lg:col-span-4 xl:col-span-3">
        <TeamMembers />
      </div>
    </div>
  )
}
