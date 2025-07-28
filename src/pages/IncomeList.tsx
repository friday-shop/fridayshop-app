import { useEffect, useState } from 'react';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import type { IIncome } from '../types/income';
import { Table, Card, Pagination, Spinner } from 'react-bootstrap';
import EnhancedIncomeTableRow from '../components/Income/EnhancedIncomeTableRow';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';

const PER_PAGE = 20;

function IncomeList() {
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const todayString = today.toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState({
    startDate: firstDayOfMonth,
    endDate: todayString,
  });

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
          `/incomes?page=${page}&perPage=${PER_PAGE}&search=${search}&startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`,
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
  }, [page, search, searchParams]);

  useEffect(() => {
    setTitle('รายรับ');
  }, [setTitle]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/incomes?page=${page}&perPage=${PER_PAGE}&search=${search}&startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`,
      );
      setData(response.data);
      setPage(1);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.perPage) : 0;

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

  return (
    <div className="container py-4">
      <Card className="border-0 shadow-lg">
        <Card.Header className="bg-success text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h4 className="mb-0 text-white">📑 รายรับ</h4>
          <div className="d-flex flex-column flex-md-row gap-2">
            <label htmlFor="startDate" className="text-white mb-0">
              จาก:
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={searchParams.startDate}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
            />
            <label htmlFor="endDate" className="text-white mb-0 ms-2">
              ถึง:
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={searchParams.endDate}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
            />
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">รายการ/ซื้อจากร้าน</th>
                <th>รายรับ</th>
                <th>ต้นทุน</th>
                <th>กำไร</th>
                <th>ช่องทาง/ประเภท</th>
                <th>การชำระเงิน</th>
                <th className="text-center">สลิป</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-2 mb-0">กำลังโหลดข้อมูล...</p>
                  </td>
                </tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((income) => (
                  <EnhancedIncomeTableRow
                    key={income._id}
                    initialValues={income}
                    mutate={refreshData}
                    onDelete={async () => {
                      const result = await Swal.fire({
                        title: 'ยืนยันการลบ?',
                        text: 'คุณแน่ใจว่าต้องการลบข้อมูลนี้?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#FE5C73',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'ลบ',
                        cancelButtonText: 'ยกเลิก',
                      });

                      if (result.isConfirmed) {
                        try {
                          await axiosInstance.delete(`/incomes/${income._id}`);
                          if (data) {
                            setData({
                              ...data,
                              total: data.total - 1,
                              data: data.data.filter(
                                (i) => i._id !== income._id,
                              ),
                            });
                          }
                          Swal.fire('Deleted!', 'ลบข้อมูลสำเร็จ', 'success');
                        } catch (error) {
                          const axiosError = error as AxiosError;
                          Swal.fire(
                            'Error',
                            axiosError.message || 'ไม่สามารถลบได้',
                            'error',
                          );
                        }
                      }
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          <Pagination>
            <Pagination.First
              onClick={() => setPage(1)}
              disabled={page === 1}
            />
            <Pagination.Prev
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            />
            {[...Array(totalPages).keys()].map((p) => (
              <Pagination.Item
                key={p + 1}
                active={p + 1 === page}
                onClick={() => setPage(p + 1)}
              >
                {p + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            />
            <Pagination.Last
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            />
          </Pagination>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default IncomeList;
