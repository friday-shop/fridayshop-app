import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import type { IIncome } from '../types/income';
import { GrTextAlignCenter } from 'react-icons/gr';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function IncomeList() {
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [incomes, setIncomes] = useState<IIncome[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] = useState<HttpResponsePagination<IIncome> | null>(
    null,
  );
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/incomes?page=${page}&perPage=${PER_PAGE}&search=${search}`,
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
    setTitle('รายรับ');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setIncomes(data.data);
      } else {
        setIncomes((prevIncomes) => [...prevIncomes, ...data.data]);
      }

      setHasMore(data.page * data.perPage < data.total);
    }
  }, [data]);

  const fetchMoreData = () => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/incomes?page=${page}&perPage=${PER_PAGE}&search=${search}`,
      );
      setData(response.data);
      setIncomes(response.data.data); // Reset incomes on refresh
      setPage(1); // Reset page to 1 on refresh
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

  // Define column headers for the card layout
  const columnHeaders = [
    'วันที่',
    'รายการ',
    'รายรับ',
    'ต้นทุน',
    'กำไร',
    'ช่องทางขาย',
    'ประเภท',
    'ธนาคาร',
    'ผู้จำหน่าย',
    'ลูกค้า',
    'อ้างอิง',
    'ค่าธรรมเนียม',
    'หมายเหตุ',
    'สร้างเมื่อ',
    'อัปเดตเมื่อ',
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ textAlign: 'center' }}>
        บัญชีรายรับ
      </h2>

      {/* Header Row for the card-like display */}
      {/* เปลี่ยน `fw-semibold` เป็น `fw-bold` เพื่อให้ตัวหนาขึ้นอีก */}
      <div className="row g-2 fw-bold mb-2">
        {columnHeaders.map((header, index) => (
          <div key={index} className="col text-center" style={{ flex: '1' }}>
            {header}
          </div>
        ))}
      </div>

      <InfiniteScroll
        dataLength={incomes.length}
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
              {incomes.length > 0 ? 'คุณดูข้อมูลทั้งหมดแล้ว' : 'ไม่พบข้อมูล'}
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
          {' '}
          {/* Using d-grid for vertical spacing between items */}
          {incomes.map((income, index) => {
            const isEvenRow = index % 2 === 0;
            const cardBackgroundColor = isEvenRow
              ? 'bg-white'
              : 'bg-info bg-opacity-10'; // Alternating colors
            const textColor = isEvenRow ? 'text-dark' : 'text-primary';

            const date = new Date(income.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const time = new Date(income.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={income._id}
                className={`card p-3 shadow-sm border-0 ${cardBackgroundColor} ${textColor}`}
                style={{ borderRadius: '12px' }}
              >
                <div className="row g-2 align-items-center">
                  {/* Date */}
                  <div className="col text-center">{date}</div>
                  {/* Item (with image/avatar if applicable, as per your image) */}
                  <div className="col d-flex align-items-center gap-2">
                    {/* Assuming income.imageUrl exists for the avatar */}

                    <span className="fw-semibold">{income.item}</span>
                  </div>
                  {/* Income */}
                  <div className="col text-center">
                    {income.income.toLocaleString()}
                  </div>
                  {/* Cost */}
                  <div className="col text-center">
                    {income.cost.toLocaleString()}
                  </div>
                  {/* Profit */}
                  <div className="col text-center">
                    {income.profit.toLocaleString()}
                  </div>
                  {/* Sales Channel */}
                  <div className="col text-center">
                    {income.sales_channel || '-'}
                  </div>
                  {/* Sales Type */}
                  <div className="col text-center">
                    {income.sales_type || '-'}
                  </div>
                  {/* Bank */}
                  <div className="col text-center">{income.bank || '-'}</div>
                  {/* Supplier */}
                  <div className="col text-center">
                    {income.supplier || '-'}
                  </div>
                  {/* Customer */}
                  <div className="col text-center">
                    {income.customer || '-'}
                  </div>
                  {/* Reference */}
                  <div className="col text-center">
                    {income.reference || '-'}
                  </div>
                  {/* Fee */}
                  <div className="col text-center">
                    {income.fee?.toLocaleString() ?? '-'}
                  </div>
                  {/* Note */}
                  <div className="col text-center">{income.note || '-'}</div>
                  {/* Created At */}
                  <div className="col text-center">
                    {new Date(income.createdAt).toLocaleDateString()}
                  </div>
                  {/* Updated At */}
                  <div className="col text-center">
                    {new Date(income.updatedAt).toLocaleDateString()}
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

export default IncomeList;
