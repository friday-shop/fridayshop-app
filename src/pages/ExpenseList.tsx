import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import type { IExpense } from '../types/expense';
import ExpenseTable from '../components/Expense/ExpenseTable';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function ExpensesList() {
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] = useState<HttpResponsePagination<IExpense> | null>(
    null,
  );
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/expenses?page=${page}&perPage=${PER_PAGE}&search=${search}`,
        );
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, search]);

  useEffect(() => {
    setTitle('รายจ่าย');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setExpenses(data.data);
      } else {
        setExpenses((prev) => [...prev, ...data.data]);
      }
      setHasMore(data.page * data.perPage < data.total);
    }
  }, [data]);

  const fetchMoreData = () => {
    if (!isLoading) setPage((prev) => prev + 1);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/expenses?page=1&perPage=${PER_PAGE}&search=${search}`,
      );
      setData(response.data);
      setExpenses(response.data.data);
      setPage(1);
      setHasMore(
        response.data.page * response.data.perPage < response.data.total,
      );
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error && page === 1) {
    return (
      <div className="container text-center mt-5">
        <h4 className="text-danger">เกิดข้อผิดพลาด!</h4>
        <p>ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>
        <button className="btn btn-primary" onClick={refreshData}>
          ลองใหม่
        </button>
      </div>
    );
  }

  const columnHeaders = [
    'วันที่',
    'รายการ',
    'จำนวนเงิน',
    'หมวดหมู่',
    'วิธีจ่าย',
    'บัญชี',
    'ผู้ขาย',
    'หมายเหตุ',
    'เอกสาร',
    // 'สลิป',
    'อ้างอิง',
    'ค่าธรรมเนียม',
    'สร้างเมื่อ',
    'อัปเดตเมื่อ',
  ];

  const columnStyles = [
    { width: '100px' },
    { width: '150px' },
    { width: '100px' },
    { width: '100px' },
    { width: '100px' },
    { width: '100px' },
    { width: '120px' },
    { width: '120px' },
    { width: '120px' },
    { width: '120px' },
    { width: '100px' },
    { width: '100px' },
    { width: '100px' },
    { width: '100px' },
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">บัญชีรายจ่าย</h2>

      <div className="d-flex fw-bold mb-2">
        {columnHeaders.map((header, index) => (
          <div key={index} className="text-center" style={columnStyles[index]}>
            {header}
          </div>
        ))}
      </div>

      <ExpenseTable expenses={expenses} />
    </div>
  );
}

export default ExpensesList;
