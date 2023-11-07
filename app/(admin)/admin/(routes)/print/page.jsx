

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
import { fetchPrintList } from "@/lib/actions/print.action"
import PrintForm from "@/components/forms/PrintFrom"
import DeletePrint from "@/components/forms/deletePrint"

const PrintPage = async ({ searchParams }) => {




  const print = await fetchPrintList({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? searchParams.page : 1,
    pageSize: 10,
  });
  // console.log(print.print)
  return (
    <div>

      <div className="px-2 lg:px-4">

      
            <PrintForm />
        
        <Card className="p-3 shadow-lg mt-4">
          <h5 className="font-semibold py-3 border-b border-muted">
            Print List
          </h5>
          {
            print.print && print.print.length > 0 ? (
              <Table>
                {/* <TableCaption >A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead >Title</TableHead>
                    <TableHead >Image</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    print.print.map((item, index) => (

                      <TableRow key={index}> {/* Don't forget to add a unique 'key' prop for each mapped element */}
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="font-medium">{item.image ?
                          (
                            <div className="relative  w-[100px] h-[100px]">
                              <Image src={`/assets/images/${item?.image}`} alt={item.title} fill className='  w-[100px] h-[100px] object-cover rounded-md bg-no-repeat' />
                            </div>
                          ) : ('')
                        }</TableCell>
                        <TableCell >
                          <div className=" flex gap-3 items-center ">
                            <Link href={`/admin/print/edit/${item._id}`}>
                              <FileEdit size={18} className="" />

                            </Link>
                            <span>

                              <DeletePrint id={item._id} />
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
          <Pagination className={"mt-4"} path='admin/print'
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={print.isNext} />
        </Card>
      </div>
    </div >
  )
}

export default PrintPage