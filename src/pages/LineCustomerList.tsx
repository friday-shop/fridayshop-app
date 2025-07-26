import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ILineCustomer } from '../types/line-customer';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import LineCustomerItem from '../components/LineCustomer/LineCustomerItem';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function LineCustomer() {
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [lineCustomers, setLineCustomers] = useState<ILineCustomer[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] =
    useState<HttpResponsePagination<ILineCustomer> | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/line-customers?page=${page}&perPage=${PER_PAGE}&search=${search}`,
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
    setTitle('ลูกค้า Line');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setLineCustomers(data.data);
      } else {
        setLineCustomers((prevLineCustomers) => [
          ...prevLineCustomers,
          ...data.data,
        ]);
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
        `/line-customers?page=${page}&perPage=${PER_PAGE}&search=${search}`,
      );
      setData(response.data);
      setLineCustomers(response.data.data);
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

  return (
    <div className="container py-4">
      <InfiniteScroll
        dataLength={lineCustomers.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        }
        endMessage={
          <p style={{ textAlign: 'center' }} className="my-4 text-muted">
            <b>หมดแล้วจ้า! คุณได้ดูสินค้าทุกประเภทแล้ว</b>
          </p>
        }
        pullDownToRefresh
        pullDownToRefreshThreshold={100}
        refreshFunction={refreshData}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }} className="text-muted py-3">
            &#8595; ลากลงเพื่อรีเฟรช
          </h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }} className="text-primary py-3">
            &#8593; ปล่อยเพื่อรีเฟรช
          </h3>
        }
      >
        <div className="row g-4">
          {lineCustomers.map((lineCustomer) => (
            <div key={lineCustomer._id} className="col-md-6 col-12">
              <LineCustomerItem
                initialValues={lineCustomer}
                mutate={refreshData}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default LineCustomer;
