import { useEffect } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory"

import {
  useMyRestaurantQuery,
  usePendingOrdersSubscription,
} from "../../__generated__/types.react-apollo"
import { Dish } from "../../components/dish"

export const MyRestaurantPage = () => {
  const { id } = useParams<IParams>()
  const { data } = useMyRestaurantQuery({
    variables: {
      input: {
        id: +id,
      },
    },
  })

  const chartData = [
    { x: 1, y: 3000 },
    { x: 2, y: 1500 },
    { x: 3, y: 4200 },
    { x: 4, y: 2300 },
    { x: 5, y: 7100 },
    { x: 6, y: 6500 },
    { x: 7, y: 4500 },
  ]

  const { data: subscriptionData } = usePendingOrdersSubscription()
  const router = useRouter()
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      router.push(`/opders/${subscriptionData.pendingOrders.id}`)
    }
  }, [router, subscriptionData])

  return (
    <div>
      <div
        className="bg-gray-700 bg-cover bg-center py-28"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="mb-10 text-4xl font-medium">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          href={`/restaurants/${id}/add-dish`}
          className="mr-8 bg-gray-800 px-10 py-3 text-white"
        >
          Add Dish &rarr;
        </Link>
        <Link href="" className="bg-lime-700 px-10 py-3 text-white">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4>Please upload a dish</h4>
          ) : (
            <div className="mt-16 grid gap-x-5 gap-y-10 md:grid-cols-3">
              {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                <Dish
                  key={index}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="mx-auto">
            <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryLabel style={{ fontSize: 18 }} renderInPortal dy={-20} />
                }
                data={data?.myRestaurant.restaurant?.orders.map(order => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    stroke: "blue",
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 20, fill: "#3d7c0f" },
                }}
                dependentAxis
                tickFormat={tick => `$${tick}`}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 20,
                    fill: "#3d7c0f",
                    angle: 45,
                  },
                }}
                tickFormat={tick => new Date(tick).toLocaleDateString("ru")}
              />
            </VictoryChart>
            <VictoryPie data={chartData} />
            <VictoryChart domainPadding={20}>
              <VictoryAxis tickFormat={step => `$${step / 1000}k`} dependentAxis />
              <VictoryAxis tickFormat={step => `Day ${step}`} />
              <VictoryBar data={chartData} />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  )
}
