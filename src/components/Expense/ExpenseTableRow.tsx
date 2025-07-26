import React from 'react';
import type { IExpense } from '../../types/expense';
import { BsPencilSquare, BsTrash, BsPaperclip } from 'react-icons/bs';
import {
  Badge,
  Button,
  Image as ImageIcon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

interface ExpenseTableRowProps {
  expense: IExpense;
  onShowSlip: (imageUrl: string) => void;
  onShowDocument: (documentInfo: string) => void;
}

const ExpenseTableRow: React.FC<ExpenseTableRowProps> = ({
  expense,
  onShowSlip,
  onShowDocument,
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('th-TH', {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
    });

  const formatCurrency = (num: number) =>
    `฿${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getCategoryBadge = (category: string) => {
    const colors: { [key: string]: string } = {
      สวัสดิการ: 'success',
      โทรคมนาคม: 'info',
      เทคโนโลยี: 'primary',
      อุปกรณ์สำนักงาน: 'secondary',
      โลจิสติกส์: 'warning',
      ค่าเช่า: 'dark',
      ค่าสาธารณูปโภค: 'info',
    };
    return (
      <Badge
        bg={colors[category] || 'light'}
        text={colors[category] === 'light' ? 'dark' : undefined}
      >
        {category}
      </Badge>
    );
  };

  return (
    <tr>
      <td className="ps-4">
        <div className="fw-bold">{expense.item}</div>
        <div className="text-muted small">
          {formatDate(expense.date)} • {expense.vendor}
        </div>
      </td>
      <td className="text-danger fw-bold fs-5 text-end">
        {formatCurrency(expense.amount)}
      </td>
      <td className="text-center">{getCategoryBadge(expense.category)}</td>
      <td>
        <div>{expense.payment_method}</div>
        <div className="text-muted small">{expense.account}</div>
      </td>
      <td className="text-center">
        {expense.slip_image ? (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onShowSlip(expense.slip_image!)}
          >
            <ImageIcon /> สลิป
          </Button>
        ) : expense.document ? (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onShowDocument(expense.document!)}
          >
            <BsPaperclip /> เอกสาร
          </Button>
        ) : (
          '-'
        )}
      </td>
      <td>
        <OverlayTrigger placement="top" overlay={<Tooltip>แก้ไข</Tooltip>}>
          <Button variant="outline-warning" size="sm" className="me-2">
            <BsPencilSquare />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>ลบ</Tooltip>}>
          <Button variant="outline-danger" size="sm">
            <BsTrash />
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
  );
};

export default ExpenseTableRow;
