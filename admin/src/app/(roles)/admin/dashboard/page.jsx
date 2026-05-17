import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { PaymentLinkGenerator } from "@/components/payment-link-generator";

import data from "./data.json";

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6">
          <div className="lg:col-span-2">
            <ChartAreaInteractive />
          </div>
          <div className="lg:col-span-1">
            <PaymentLinkGenerator />

          </div>
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
