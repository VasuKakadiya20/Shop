import React, { useEffect, useState } from 'react'
import { FaFileInvoice } from "react-icons/fa6";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchDataFromApi } from '../../api';
import { toast, ToastContainer } from "react-toastify";

function InvoiceData() {

    const [Iitem, setIItems] = useState([])
    useEffect(()=>{
        fetchDataFromApi("/item/").then((data)=>{
            console.log("backend to data:-", data)
            setIItems(data)
        })
    },[])

   const invoice = (items) => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(16);
    doc.text("TAX INVOICE", 105, 15, { align: "center" });

    doc.setFontSize(22);
    doc.text("BRAKERY", 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.text(
        "GROUND FLOOR A 101 - MAHADEV SOC., NANA VARACHA, SURAT.",
        105,
        31,
        { align: "center" }
    );
    doc.text("GST No. ABC2DGE4786", 105, 36, { align: "center" });

    autoTable(doc, {
        startY: 42,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },

        body: [
            [
                { content: "Bill to\n" + items.cname, rowSpan: 2 },
                { content: "Place of Supply\n" + items.cname, rowSpan: 2 },
                "INVOICE No",
                items.invoiceNo
            ],
            ["Dated", items.Date],
        ],
        columnStyles: {
            2: { halign: "center" },
            3: { halign: "center" }
        }
    });

    const productRows = items.items.map((p) => [
        p.itemname,
       p.hsn,
        p.qty,
        "pcs",
        p.price,
        p.total ? p.total : p.qty * p.price
    ]);

    const totalAmount = productRows.reduce((sum, row) => sum + Number(row[5]), 0);
    console.log("totalAmount",totalAmount)
    const calculateRoundOff = (amount) => {
  const rounded = Math.round(amount);
  const diff = (rounded - amount).toFixed(2);
  return diff;
    };

    const roundoff = calculateRoundOff(totalAmount)
    console.log("roundoff",roundoff)
    const finalAmount  = Math.round(totalAmount + totalAmount * 0.05).toFixed(2)

    autoTable(doc, {
    head: [["Description of Goods", "HSN CODE","QTY", "Units", "Rate", "Amount"]],
    body: productRows,
    startY: doc.lastAutoTable.finalY + 2,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [158, 157, 157] },

    
    columnStyles: {
        0: { cellWidth: 82 },
        1: { cellWidth: 20, halign: "center"},
        2: { cellWidth: 15, halign: "right" }, 
        3: { cellWidth: 15, halign: "left" },  
        4: { cellWidth: 20, halign: "right" }, 
        5: { cellWidth: 30, halign: "right" }, 
    },

    tableWidth: "auto"
});

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 3 },

        body: [
            
            [
                { content: "Total"},
                { content: totalAmount.toString(), styles: { halign: "right" , fontStyle: "bold"} }
            ],
            [
                { content: "Taxable Value" , styles: {fontStyle: "bold", fontSize : 10}},
                { content: totalAmount.toString(), styles: { halign: "right" ,fontStyle: "bold" } }
            ],
            [
                { content: "ADD CGST 2.5%" , styles: {fontStyle:"bold", fontSize : 10}},
                { content: (totalAmount * 0.025).toFixed(2), styles: { halign: "right" } }
            ],
            [
                { content: "ADD SGST 2.5%" ,styles: {fontStyle:"bold", fontSize : 10}},
                { content: (totalAmount * 0.025).toFixed(2), styles: { halign: "right" } }
            ],
            [
                { content: "ROUND OFF" , styles: {fontSize: 8} },
                { content: roundoff, styles: { halign: "right" } }
            ],
            [
                 { content: "Total" ,styles: {fontStyle:"bold" , fontSize : 10}},
                {
                    content: finalAmount,
                    styles: { halign: "right", fontStyle: "bold" }
                }
            ],
        ]
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },

        body: [
            [
                {
                    content:
                        "Amount Chargeable (in words)\n" +
                        "Rupees " +
                        numberToWords(finalAmount),
                    colSpan: 3
                },
                {
                    content:
                        "FOR BRAKERY\n\nABC \nAuthorised Signatory",
                    colSpan: 3,
                    styles: { halign: "right" }
                }
            ]
        ]
    });

    doc.save(`${items.cname}_Invoice.pdf`);
    toast.success("Invoices Download!")
};

const numberToWords = (num) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    })
        .format(num)
        .replace("₹", "")
        .trim();
};

    return (
        <>
           <ToastContainer position="top-right" autoClose={2000} theme="colored" />
            <div className="table-wrapper">
                <div className="table-header">
                    <span>All Invoices</span>
                </div>
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Payment</th>
                            <th>Total Items</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Iitem.sort((a, b) => new Date(b.Date) - new Date(a.Date)).map((items, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{items.cname}</td>
                                    <td>{items.Date}</td>
                                    <td>{items.Payment}</td>
                                    <td>{items.totalitems}</td>
                                    <td className="iicon" onClick={() => invoice(items)}><FaFileInvoice style={{ cursor: "pointer" }} /></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default InvoiceData
