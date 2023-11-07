

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
import Pagination from "@/components/shared/Pagination"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { fetchOtherList } from "@/lib/actions/other.action"
import OtherForm from "@/components/forms/OtherForm"
import DeleteOther from "@/components/forms/deleteOther"

const OtherPage = async ({ searchParams }) => {




  const other = await fetchOtherList({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? searchParams.page : 1,
    pageSize: 10,
  });
  // console.log(other.other)
  return (
    <div>

      <div className="px-2 lg:px-4">

        <OtherForm />
        <Card className="p-3 shadow-lg mt-4">
          <h5 className="font-semibold py-3 border-b border-muted">
            Other Works List
          </h5>
          {
            other.other && other.other.length > 0 ? (
              <Table>
                {/* <TableCaption >A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead >Title</TableHead>
                    <TableHead >Cover Image</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    other.other.map((item, index) => (

                      <TableRow key={index}> {/* Don't forget to add a unique 'key' prop for each mapped element */}
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="font-medium">{item.cover_img ?
                          (
                            <Image src={`/assets/images/${item?.cover_img}`} alt={item.title} width={100} height={100} className="rounded-md" />
                          ) : ('')
                        }</TableCell>
                       
                        <TableCell className="font-medium">
                          <Link href={`/admin/other-works/view/${item._id}`}>
                          <Button className="bg-blue-600 w-fit whitespace-nowrap" >View Details</Button>
                          </Link>
                          </TableCell>
                        <TableCell >
                          <div className=" flex gap-3 items-center ">
                            <Link href={`/admin/other-works/edit/${item._id}`}>
                              <FileEdit size={18} className="" />

                            </Link>
                            <span>

                              <DeleteOther id={item._id} />
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
          <Pagination className={"mt-4"} path='admin/other-works'
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={other.isNext} />
        </Card>
      </div>
    </div >
  )
}

export default OtherPage