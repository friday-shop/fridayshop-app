import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { IProductResponse } from '../types/product';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import { useParams } from 'react-router-dom';
import type { ICategory } from '../types/category';
import ProductCreateForm from '../components/ProductCreateForm';
import ProductCard from '../components/ProductCard';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function ProductList() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { setTitle, setContent } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] =
    useState<HttpResponsePagination<IProductResponse> | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/products?page=${page}&perPage=${PER_PAGE}&categoryId=${categoryId || ''}`,
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
  }, [page]);

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const response = await axiosInstance.get<ICategory>(
            `/categories/${categoryId}`,
          );
          setTitle(response.data?.name);
          setContent(
            <ProductCreateForm categoryId={categoryId} mutate={refreshData} />,
          );
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      }
    };
    fetchCategory();
  }, [setTitle, categoryId]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setProducts(data.data);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.data]);
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
        `/products?page=${page}&perPage=${PER_PAGE}&categoryId=${categoryId || ''}`,
      );
      setData(response.data);
      setProducts(response.data.data);
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

  if (isLoading && page === 1) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        />
      </div>
    );
  }

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
        dataLength={products.length}
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
          {products.map((product) => (
            <div
              key={product._id}
              className="col-xl-3 col-lg-4 col-md-6 col-12"
            >
              <ProductCard data={product} mutate={refreshData} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ProductList;
