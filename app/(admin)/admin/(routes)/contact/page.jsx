

import { Card } from "@/components/ui/card"
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
import { fetchContactList } from "@/lib/actions/contact.action"
import { Button } from "@/components/ui/button"

const ContactPage = async ({ searchParams }) => {



    const contact = await fetchContactList({
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? searchParams.page : 1,
        pageSize: 10,
    });

    return (
        <div>

            <div className="px-2 lg:px-4">

                <Card className="p-3 shadow-lg mt-4">
                    <h5 className="font-semibold py-3 border-b border-muted">
                        Contact List
                    </h5>
                    {
                        contact.contact && contact.contact.length > 0 ? (
                            <Table>
                                {/* <TableCaption >A list of your recent invoices.</TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead >Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead>View</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        contact.contact.map((item, index) => (
                                            <TableRow key={index}> {/* Don't forget to add a unique 'key' prop for each mapped element */}
                                                <TableCell className="font-medium">{item.fname} {item.lname}</TableCell>
                                                <TableCell className="font-medium">{item.email}</TableCell>
                                                <TableCell className="font-medium">{item.phone}</TableCell>
                                                <TableCell className="font-medium">{item.subject}</TableCell>
                                                <TableCell className="font-medium">{item.message.length > 50 ? item.message.slice(0, 50) + "..." : item.message}</TableCell>
                                                <TableCell className="font-medium">
                                                    <Link href={`/admin/contact/view/${item._id}`}>
                                                        <Button className="bg-blue-600 w-fit whitespace-nowrap" >View Details</Button>
                                                    </Link>
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
                    <Pagination path='admin/contact'
                        pageNumber={searchParams?.page ? +searchParams.page : 1}
                        isNext={contact.isNext} />
                </Card>
            </div>
        </div>
    )
}

export default ContactPage