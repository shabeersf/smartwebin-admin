

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
import PortfolioForm from "@/components/forms/PortfolioForm"
import { fetchPortfolioList, fetchcatList } from "@/lib/actions/portfolio.action"
import DeletePortfolio from "@/components/forms/deletePortfolio"
import Image from "next/image"

const PortfolioPage = async ({ searchParams }) => {

  const catList = await fetchcatList()


  const portfolio = await fetchPortfolioList({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? searchParams.page : 1,
    pageSize: 10,
  });
  // console.log(portfolio.portfolio)
  return (
    <div>

      <div className="px-2 lg:px-4">


      {
          catList.length > 0 && (
            <PortfolioForm catList={catList} />
          )
        }

        <Card className="p-3 shadow-lg mt-4">
          <h5 className="font-semibold py-3 border-b border-muted">
            Website List
          </h5>
          {
            portfolio.portfolio && portfolio.portfolio.length > 0 ? (
              <Table>
                {/* <TableCaption >A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead >Website Name</TableHead>
                    <TableHead >Image</TableHead>
                    <TableHead>Weblink</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    portfolio.portfolio.map((item, index) => (

                      <TableRow key={index}> {/* Don't forget to add a unique 'key' prop for each mapped element */}
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="font-medium">{item.image ?
                          (
                            <div className="relative  w-[100px] h-[100px]">
                              <Image src={`/assets/images/${item?.image}`} alt={item.title} fill className='  w-[100px] h-[100px] object-cover rounded-md bg-no-repeat' />
                            </div>
                          ) : ('')
                        }</TableCell>
                        <TableCell className="font-medium">{item.linkUrl}</TableCell>
                        <TableCell className="font-medium">{item.category.title}</TableCell>
                        <TableCell >
                          <div className=" flex gap-3 items-center ">
                            <Link href={`/admin/website/edit/${item._id}`}>
                              <FileEdit size={18} className="" />

                            </Link>
                            <span>

                              <DeletePortfolio id={item._id} />
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
          <Pagination className={"mt-4"} path='admin/website'
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={portfolio.isNext} />
        </Card>
      </div>
    </div >
  )
}

export default PortfolioPage