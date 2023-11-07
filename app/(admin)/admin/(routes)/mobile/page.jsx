

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
import { fetchMobileList } from "@/lib/actions/mobile.action"
import MobileForm from "@/components/forms/MobileForm"
import { Button } from "@/components/ui/button"
import DeleteMobile from "@/components/forms/deleteMobile"

const MobilePage = async ({ searchParams }) => {




  const mobile = await fetchMobileList({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? searchParams.page : 1,
    pageSize: 10,
  });
  // console.log(mobile.mobile)
  return (
    <div>

      <div className="px-2 lg:px-4">

        <MobileForm />
        <Card className="p-3 shadow-lg mt-4">
          <h5 className="font-semibold py-3 border-b border-muted">
            Mobile List
          </h5>
          {
            mobile.mobile && mobile.mobile.length > 0 ? (
              <Table>
                {/* <TableCaption >A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead >Title</TableHead>
                    <TableHead >Logo</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    mobile.mobile.map((item, index) => (

                      <TableRow key={index}> {/* Don't forget to add a unique 'key' prop for each mapped element */}
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="font-medium">{item.logo ?
                          (
                            <Image src={`/assets/images/${item?.logo}`} alt={item.title} width={100} height={100} className="rounded-md" />
                          ) : ('')
                        }</TableCell>
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell className="font-medium">
                          {item.description.length > 70
                            ? `${item.description.slice(0, 70)}...`
                            : item.description}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link href={`/admin/mobile/view/${item._id}`}>
                          <Button className="bg-blue-600 w-fit whitespace-nowrap" >View Details</Button>
                          </Link>
                          </TableCell>
                        <TableCell >
                          <div className=" flex gap-3 items-center ">
                            <Link href={`/admin/mobile/edit/${item._id}`}>
                              <FileEdit size={18} className="" />

                            </Link>
                            <span>

                              <DeleteMobile id={item._id} />
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
          <Pagination className={"mt-4"} path='admin/mobile'
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={mobile.isNext} />
        </Card>
      </div>
    </div >
  )
}

export default MobilePage