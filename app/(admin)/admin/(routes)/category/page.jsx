

import { Card } from "@/components/ui/card"
import { FileEdit } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import CategoryForm from "@/components/forms/CategoryForm"
import DeleteCategory from "@/components/forms/deleteCategory"
import { fetchCategoryList } from "@/lib/actions/category.action"
import Pagination from "@/components/shared/Pagination"

const CategoryPage = async ({ searchParams }) => {

  const category = await fetchCategoryList({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? searchParams.page : 1,
    pageSize: 10,
  });

  return (
    <div>

      <div className="px-2 lg:px-4">

        <CategoryForm />
        <Card className="p-3 shadow-lg mt-4">
          <h5 className="font-semibold py-3 border-b border-muted">
            Category List
          </h5>
          {
            category.category && category.category.length > 0 ? (
              <Table>
                {/* <TableCaption >A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead >Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    category.category.map((item, index) => (
                      <TableRow key={index}> {/* Don't forget to add a unique 'key' prop for each mapped element */}
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.status ? "Active" : "Inactive"}</TableCell>
                        <TableCell>
                          <div className=" flex gap-3 items-center ">
                            <Link href={`/admin/category/edit/${item._id}`}>

                              <FileEdit size={18} className="" />

                            </Link>
                            <span>
                              <DeleteCategory item={item} />
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))

                  }


                </TableBody>
              </Table>
            ) : (
              <p className="text-center mt-4 text-slate-700 font-bold">No data found</p>
            )
          }
          <Pagination path='admin/category'
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={category.isNext} />
        </Card>
      </div>
    </div>
  )
}

export default CategoryPage