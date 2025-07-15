import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import type { IExpense } from '../types/expense';

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

      <InfiniteScroll
        dataLength={expenses.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="text-center my-3">
            {isLoading ? 'กำลังโหลด...' : 'กำลังโหลดข้อมูล...'}
          </div>
        }
        endMessage={
          <p className="text-center my-3">
            <b>
              {expenses.length > 0 ? 'คุณดูข้อมูลทั้งหมดแล้ว' : 'ไม่พบข้อมูล'}
            </b>
          </p>
        }
        refreshFunction={refreshData}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; ดึงลงเพื่อรีเฟรช</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; ปล่อยเพื่อรีเฟรช</h3>
        }
      >
        <div className="d-grid gap-2">
          {expenses.map((expense, index) => {
            const isEvenRow = index % 2 === 0;
            const cardBackgroundColor = isEvenRow
              ? 'bg-white'
              : 'bg-danger bg-opacity-10';
            const textColor = isEvenRow ? 'text-dark' : 'text-danger';

            const date = new Date(expense.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={expense._id}
                className={`card p-3 shadow-sm border-0 ${cardBackgroundColor} ${textColor}`}
                style={{ borderRadius: '12px' }}
              >
                <div className="d-flex align-items-center">
                  <div style={columnStyles[0]} className="text-center">
                    {date}
                  </div>
                  <div
                    style={columnStyles[1]}
                    className="text-start fw-semibold"
                  >
                    {expense.item}
                  </div>
                  <div style={columnStyles[2]} className="text-center">
                    {expense.amount.toLocaleString()}
                  </div>
                  <div style={columnStyles[3]} className="text-center">
                    {expense.category || '-'}
                  </div>
                  <div style={columnStyles[4]} className="text-center">
                    {expense.payment_method || '-'}
                  </div>
                  <div style={columnStyles[5]} className="text-center">
                    {expense.account || '-'}
                  </div>
                  <div style={columnStyles[6]} className="text-center">
                    {expense.vendor || '-'}
                  </div>
                  <div style={columnStyles[7]} className="text-center">
                    {expense.note || '-'}
                  </div>
                  <div style={columnStyles[8]} className="text-center">
                    {expense.document || '-'}
                  </div>
                  {/* <div style={columnStyles[9]} className="text-center">
                    {expense.slip_image || '-'}
                  </div> */}
                  <div style={columnStyles[10]} className="text-center">
                    {expense.reference || '-'}
                  </div>
                  <div style={columnStyles[11]} className="text-center">
                    {expense.fee?.toLocaleString() ?? '-'}
                  </div>
                  <div style={columnStyles[12]} className="text-center">
                    {expense.createdAt
                      ? new Date(expense.createdAt).toLocaleDateString()
                      : '-'}
                  </div>
                  <div style={columnStyles[13]} className="text-center">
                    {expense.updatedAt
                      ? new Date(expense.updatedAt).toLocaleDateString()
                      : '-'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ExpensesList;
