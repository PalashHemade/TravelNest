import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from "@/models/User";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  await dbConnect();

  // Ensure models are registered
  const _pkg = Package;
  const _usr = User;

  const booking = await Booking.findById(params.id)
    .populate('package')
    .populate('user')
    .lean();

  if (!booking) notFound();

  // Access control
  if (session.user.role !== 'admin' && booking.user._id.toString() !== session.user.id) {
     return <div>Unauthorized access to this invoice.</div>;
  }

  const invoiceDate = new Date().toLocaleDateString();
  const travelDate = new Date(booking.startDate).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-6 flex justify-end print:hidden">
          <Button onclick="window.print()" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          {/* Note: In React, we'd use a client component for the button or script, 
              but for simplicity let's assume the user uses browser print or we add a script */}
             <script dangerouslySetInnerHTML={{__html: `
                document.querySelector('button').addEventListener('click', () => window.print());
             `}} />
        </div>

        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border print:shadow-none print:border-none" id="invoice">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">TravelNest</h1>
              <p className="text-sm text-gray-500">
                123 Travel Lane<br />
                Adventure City, AC 12345<br />
                support@travelnest.com
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-2">INVOICE</h2>
              <p className="text-sm text-gray-500">
                Invoice #: INV-{booking._id.toString().slice(-6).toUpperCase()}<br />
                Date: {invoiceDate}
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Bill To</h3>
            <div className="text-gray-900">
              <p className="font-semibold">{booking.contactEmail}</p>
              <p>{booking.contactPhone}</p>
              {booking.user?.name && <p>{booking.user.name}</p>}
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 font-semibold">Description</th>
                <th className="text-right py-4 font-semibold">Price</th>
                <th className="text-right py-4 font-semibold">Travelers</th>
                <th className="text-right py-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-4">
                  <p className="font-medium text-gray-900">{booking.package.title}</p>
                  <p className="text-sm text-gray-500">Travel Date: {travelDate}</p>
                  <p className="text-sm text-gray-500">{booking.package.duration} Days</p>
                </td>
                <td className="text-right py-4">${booking.package.price.toLocaleString()}</td>
                <td className="text-right py-4">{booking.travelers}</td>
                <td className="text-right py-4 font-medium">${booking.totalPrice.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="text-right space-y-2">
              <div className="flex justify-between gap-12">
                <span className="text-gray-500">Subtotal</span>
                <span>${booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-12">
                <span className="text-gray-500">Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between gap-12 text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">${booking.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-8 border-t">
            <p className="mb-2">Thank you for choosing TravelNest!</p>
            <p>If you have any questions about this invoice, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
