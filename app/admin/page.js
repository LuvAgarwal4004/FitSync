import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";

export default async function AdminPage() {
  const session = await isAdmin();

  if (!session) redirect("/");

  return (
    <div className="
      min-h-screen
      bg-gray-50
      p-4
      sm:p-6
      lg:p-8
    ">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="
            text-3xl
            sm:text-4xl
            font-bold
            text-gray-900
          ">
            Admin Dashboard
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Welcome back, manage your store from here.
          </p>
        </div>

        {/* Cards */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          <Link href="/admin/add">
            <div className="
              bg-blue-600
              text-white
              rounded-3xl
              p-8
              shadow-lg
              hover:scale-105
              transition
              cursor-pointer
            ">
              <div className="text-5xl mb-4">
                ➕
              </div>

              <h2 className="
                text-2xl
                font-bold
              ">
                Add Product
              </h2>

              <p className="mt-2 opacity-80">
                Create and publish new products.
              </p>
            </div>
          </Link>

          <Link href="/admin/products">
            <div className="
              bg-green-600
              text-white
              rounded-3xl
              p-8
              shadow-lg
              hover:scale-105
              transition
              cursor-pointer
            ">
              <div className="text-5xl mb-4">
                📦
              </div>

              <h2 className="
                text-2xl
                font-bold
              ">
                Manage Products
              </h2>

              <p className="mt-2 opacity-80">
                Edit, update and remove products.
              </p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="
              bg-purple-600
              text-white
              rounded-3xl
              p-8
              shadow-lg
              hover:scale-105
              transition
              cursor-pointer
            ">
              <div className="text-5xl mb-4">
                🛒
              </div>

              <h2 className="
                text-2xl
                font-bold
              ">
                Orders
              </h2>

              <p className="mt-2 opacity-80">
                Track and manage customer orders.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}