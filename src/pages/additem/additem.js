// import React from 'react'

// function Additem() {
//   return (
//     <div>
//       <h1 style={{marginTop:"100px" ,marginLeft:"250px" }}>hello</h1>
//     </div>
//   )
// }

// export default Additem
import React, { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import "./additem.css"
import { MdDelete } from "react-icons/md";
import InvoiceData from "../../components/AllInvoices/data";
import { Deletedata, fetchDataFromApi, postData } from "../../api";
import { toast, ToastContainer } from "react-toastify";
import { FaFileInvoice } from "react-icons/fa6";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaEdit } from "react-icons/fa";

export default function InvoicePage() {
  const todaydate = new Date().toISOString().split("T")[0];
  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState(todaydate);
  const [items, setItems] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: "", qty: "", price: "", hsncode: "" });

  // item Adding
  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.hsncode || !currentItem.qty || !currentItem.price) return;
    setItems([...items, currentItem]);
    setCurrentItem({ name: "", qty: "", price: "", hsncode: "" });
  };

  // Client Fetching
  useEffect(() => {
    fetchDataFromApi("/client/").then((res, req) => {
      setClientList(res);
    })
  }, [])

  // Invoice Creating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !paymentMethod || !date || items.length === 0) {
      alert("Please fill all fields and add at least 1 item!");
      return;
    }

    const formattedItems = items.map(i => ({
      itemname: i.name,
      qty: Number(i.qty),
      price: Number(i.price),
      total: Number(i.qty) * Number(i.price),
      hsn: i.hsncode
    }));

    const invoiceData = {
      cname: clientName,
      Payment: paymentMethod,
      Date: date,
      items: formattedItems
    };

    try {
      const res = await postData("/item/create", invoiceData);
      console.log("Invoice Saved:", res);

      toast.success("Invoice Added Successfully!");

      loadInvoiceData();
      setShowForm(false);
      setItems([]);
      setClientName("");
      setPaymentMethod("");
      setDate(todaydate);

    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving invoice!");
    }
  };

  const removeitem = (name) => {
    const updateitem = items.filter((item) => item.name !== name);
    setItems(updateitem)
  }

  const loadInvoiceData = () => {
    fetchDataFromApi("/item/").then((data) => {
      setIItems(data);
    });
  };

  // Fething Data
  const [Iitem, setIItems] = useState([])
  useEffect(() => {
    fetchDataFromApi("/item/").then((data) => {
      console.log("backend to data:-", data)
      setIItems(data)
    })
  }, [])

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
    console.log("totalAmount", totalAmount)
    const calculateRoundOff = (amount) => {
      const rounded = Math.round(amount);
      const diff = (rounded - amount).toFixed(2);
      return diff;
    };

    const roundoff = calculateRoundOff(totalAmount)
    console.log("roundoff", roundoff)
    const finalAmount = Math.round(totalAmount + totalAmount * 0.05).toFixed(2)

    autoTable(doc, {
      head: [["Description of Goods", "HSN CODE", "QTY", "Units", "Rate", "Amount"]],
      body: productRows,
      startY: doc.lastAutoTable.finalY + 2,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [158, 157, 157] },


      columnStyles: {
        0: { cellWidth: 82 },
        1: { cellWidth: 20, halign: "center" },
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
          { content: "Total" },
          { content: totalAmount.toString(), styles: { halign: "right", fontStyle: "bold" } }
        ],
        [
          { content: "Taxable Value", styles: { fontStyle: "bold", fontSize: 10 } },
          { content: totalAmount.toString(), styles: { halign: "right", fontStyle: "bold" } }
        ],
        [
          { content: "ADD CGST 2.5%", styles: { fontStyle: "bold", fontSize: 10 } },
          { content: (totalAmount * 0.025).toFixed(2), styles: { halign: "right" } }
        ],
        [
          { content: "ADD SGST 2.5%", styles: { fontStyle: "bold", fontSize: 10 } },
          { content: (totalAmount * 0.025).toFixed(2), styles: { halign: "right" } }
        ],
        [
          { content: "ROUND OFF", styles: { fontSize: 8 } },
          { content: roundoff, styles: { halign: "right" } }
        ],
        [
          { content: "Total", styles: { fontStyle: "bold", fontSize: 10 } },
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

  const Deleteinvoice = (_id) =>{
    Deletedata(`/item/${_id}`).then((res) => {
      console.log("this is item Deleted:-",res)
     fetchDataFromApi("/item/").then((data) => {
      console.log("backend to data:-", data)
      setIItems(data)
    })
    })
  }
  
  // const updateitem = (_id) =>{
  //   setShowForm(true)
  //   fetchDataFromApi(`/item/${_id}`).then((res) => {

  //   })
  // }


  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <div className="slideDown attendance mt-5" style={{height:"100%"}}>
        <div className="container py-4" style={{ marginTop: "20px" }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Invoice Records</h2>
            <button className="addmeal" onClick={() => setShowForm(true)}>
              <span className="icon">+</span>
              <span className="text">Add Invoice</span>
            </button>
          </div>

          {/* item Add From */}
          <div
            className={`slideDown modal fade ${showForm ? "show d-block" : ""}`}
            tabIndex="-1"
          // style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Create New Invoice</h5>
                  <button className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>

                <div className="modal-body">

                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">Client Name</label>
                      <select
                        className="form-control"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      >
                        <option value="">Select Client Name</option>
                        {clientList.map((client, index) => (
                          <option key={index} value={client.cname}>{client.cname}</option>
                        ))
                        }
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="form-control"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label className="form-label">Item Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={currentItem.name}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">HSN Code</label>
                      <input
                        type="number"
                        className="form-control"
                        value={currentItem.hsncode}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, hsncode: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Qty</label>
                      <input
                        type="number"
                        className="form-control"
                        value={currentItem.qty}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, qty: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={currentItem.price}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, price: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <button className="btn btn-success w-100" onClick={handleAddItem}>
                        Add
                      </button>
                    </div>
                  </div>

                  <table className="table table-bordered mt-4 text-center">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Item Name</th>
                        <th>HSN Code</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.hsncode}</td>
                          <td>{item.qty}</td>
                          <td>{item.price}</td>
                          <td>{item.qty * item.price}</td>
                          <td className="iicon" onClick={() => removeitem(item.name)}><MdDelete /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="btn btnsave" type="submit" onClick={handleSubmit}>
                    Save Invoice
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Invoice Records */}
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
                  <th>Action</th>
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
                      <td className="iicon mr-5" onClick={() => invoice(items)}><FaFileInvoice style={{ cursor: "pointer" }} /></td>
                      <td className="gap-5"> 
                          <MdDelete style={{ cursor: "pointer", height: "1.5em", width:"1.5em", marginLeft:"10px "}} className="Dicon ml-5" onClick={() => Deleteinvoice(items._id)}/>
                          {/* <FaEdit style={{cursor: "pointer" , height:"1.5em", width: "1.5em"}} className="Dicon" onClick={()=>updateitem(items._id)}/> */}
                  </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}