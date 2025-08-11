import BuyersProfileCard from "./partials/BuyersProfileCard"
import CustomersCard from "./partials/CustomersCard"
import SalesCard from "./partials/SalesCard"
import TrafficSourceCard from "./partials/TrafficSourceCard"
import VisitorsCard from "./partials/VisitorsCard"

export default function Analytics() {
  return (
    <div className="grid auto-rows-auto grid-cols-6 gap-5">
      <div className="col-span-6 xl:col-span-3">
        <SalesCard />
      </div>
      <div className="col-span-6 xl:col-span-3">
        <VisitorsCard />
      </div>
      <div className="col-span-6 lg:col-span-3 xl:col-span-2">
        <TrafficSourceCard />
      </div>
      <div className="col-span-6 lg:col-span-3 xl:col-span-2">
        <CustomersCard />
      </div>
      <div className="col-span-6 lg:col-span-3 xl:col-span-2">
        <BuyersProfileCard />
      </div>
    </div>
  )
}
