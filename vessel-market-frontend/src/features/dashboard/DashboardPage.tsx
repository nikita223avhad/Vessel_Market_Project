import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Ship, TrendingUp } from "lucide-react";
import { getMarketData } from "../../api/marketData";
import { getVessels } from "../../api/vessels";
import { ErrorState, LoadingState } from "../../components/Status";
import { currency, percent, shortDate } from "../../lib/format";

export function DashboardPage() {
  const vessels = useQuery({ queryKey: ["vessels"], queryFn: getVessels });
  const market = useQuery({ queryKey: ["market-data"], queryFn: getMarketData });

  if (vessels.isLoading || market.isLoading) return <LoadingState label="Preparing dashboard" />;
  if (vessels.isError || market.isError) return <ErrorState message="Unable to load dashboard data." />;

  const vesselData = vessels.data ?? [];
  const marketData = market.data ?? [];
  const latestByRegion = [...marketData].sort((a, b) => b.report_date.localeCompare(a.report_date)).slice(0, 5);
  const averageHireRate =
    vesselData.length > 0 ? vesselData.reduce((sum, vessel) => sum + Number(vessel.price), 0) / vesselData.length : 0;
  const averageMarketRate =
    marketData.length > 0 ? marketData.reduce((sum, item) => sum + Number(item.average_price), 0) / marketData.length : 0;
  const variance = averageHireRate - averageMarketRate;

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p>Office performance console</p>
          <h1>Regional Vessel Market Overview</h1>
        </div>
      </header>

      <div className="metric-grid">
        <article className="metric-card">
          <Ship size={22} />
          <span>Total vessels</span>
          <strong>{vesselData.length}</strong>
        </article>
        <article className="metric-card">
          <TrendingUp size={22} />
          <span>Market data points</span>
          <strong>{marketData.length}</strong>
        </article>
        <article className="metric-card">
          {variance >= 0 ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
          <span>Avg hire vs market</span>
          <strong>{currency(variance)}</strong>
        </article>
      </div>

      <div className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <h2>Daily regional comparisons</h2>
            <p>Market rates against recorded hire rates by vessel type.</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Region</th>
                  <th>Type</th>
                  <th>Market rate</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {latestByRegion.map((item) => (
                  <tr key={item.id}>
                    <td>{shortDate(item.report_date)}</td>
                    <td>{item.region}</td>
                    <td>{item.vessel_type}</td>
                    <td>{currency(item.average_price)}</td>
                    <td>{percent(item.demand_index)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>Aggregated performance</h2>
            <p>Summary excludes HS codes, matching the initial requirement.</p>
          </div>
          <div className="comparison-block">
            <span>Average hire rate</span>
            <strong>{currency(averageHireRate)}</strong>
          </div>
          <div className="comparison-block">
            <span>Average market rate</span>
            <strong>{currency(averageMarketRate)}</strong>
          </div>
        </article>
      </div>
    </section>
  );
}
