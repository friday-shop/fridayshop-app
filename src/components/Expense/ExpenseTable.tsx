import React, { useState, useMemo } from 'react';
import ExpenseTableRow from './ExpenseTableRow';
import type { IExpense } from '../../types/expense';
import {
  Button,
  Card,
  FormControl,
  InputGroup,
  Modal,
  Table,
  Image as ImageIcon,
} from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

interface ExpenseTableProps {
  expenses: IExpense[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
  const [modalContent, setModalContent] = useState<{
    type: 'image' | 'text';
    content: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleShowSlip = (imageUrl: string) => {
    setModalContent({ type: 'image', content: imageUrl });
  };

  const handleShowDocument = (documentInfo: string) => {
    setModalContent({ type: 'text', content: documentInfo });
  };

  const handleCloseModal = () => setModalContent(null);

  const filteredExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          expense.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [expenses, searchTerm],
  );

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses],
  );

  return (
    <>
      <Card className="border-0 shadow-lg">
        <Card.Header className="bg-white border-0 pt-3 pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">💸 บันทึกรายจ่าย</h3>
            <div style={{ width: '350px' }}>
              <InputGroup>
                <FormControl
                  placeholder="ค้นหา (รายการ, ผู้ขาย, หมวดหมู่)..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <BsSearch />
                </Button>
              </InputGroup>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table
            responsive
            hover
            className="mb-0"
            style={{ verticalAlign: 'middle' }}
          >
            <thead className="table-light">
              <tr>
                <th className="ps-4">รายการ</th>
                <th className="text-end">จำนวนเงิน</th>
                <th className="text-center">หมวดหมู่</th>
                <th>ช่องทางชำระ</th>
                <th className="text-center">หลักฐาน</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <ExpenseTableRow
                  key={expense._id}
                  expense={expense}
                  onShowSlip={handleShowSlip}
                  onShowDocument={handleShowDocument}
                />
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center fw-bold">
          <span>รวม {filteredExpenses.length} รายการ</span>
          <span className="fs-5 text-danger">
            ยอดรวม:{' '}
            {totalAmount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'THB',
            })}
          </span>
        </Card.Footer>
      </Card>

      {/* Modal for Slip Image or Document Info */}
      <Modal show={modalContent !== null} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalContent?.type === 'image' ? 'สลิป' : 'ข้อมูลเอกสาร'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {modalContent?.type === 'image' ? (
            <ImageIcon src={modalContent.content} fluid rounded />
          ) : (
            <h4>{modalContent?.content}</h4>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExpenseTable;
