import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { IProvider } from '../types/provider';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import ProviderItem from '../components/Provider/ProviderItem';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function Provider() {
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [newProviders, setNewProviders] = useState<IProvider[]>([]);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] = useState<HttpResponsePagination<IProvider> | null>(
    null,
  );
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    useLayoutStore.setState({
      onCreate: () => {
        const currentDate = new Date();
        setNewProviders((prev) => [
          {
            _id: currentDate.toString(),
            name: '',
            url: '',
            imageUrl: '',
            isOpen: false,
            cookie: '',
            subDomain: '',
            filterPasswords: [],
            isUseForm: false,
            formFormat: '',
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          ...prev,
        ]);
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/providers?page=${page}&perPage=${PER_PAGE}&search=${search}`,
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
    setTitle('ร้านค้า');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setProviders(data.data);
      } else {
        setProviders((prevProviders) => [...prevProviders, ...data.data]);
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
        `/providers?page=${page}&perPage=${PER_PAGE}&search=${search}`,
      );
      setData(response.data);
      setProviders(response.data.data);
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
        dataLength={providers.length}
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
          {newProviders.map((provider) => (
            <div key={provider._id} className="col-md-6 col-12">
              <ProviderItem
                initialValues={provider}
                mutate={refreshData}
                onDelete={() => {
                  setNewProviders((prev) =>
                    prev.filter(
                      (newProvider) => newProvider._id !== provider._id,
                    ),
                  );
                }}
              />
            </div>
          ))}
          {providers.map((provider) => (
            <div key={provider._id} className="col-md-6 col-12">
              <ProviderItem initialValues={provider} mutate={refreshData} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Provider;
