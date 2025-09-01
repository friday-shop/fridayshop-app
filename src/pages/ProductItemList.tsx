import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { IProductItem } from '../types/product-item';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import { useParams } from 'react-router-dom';
import type { IProduct } from '../types/product';
import ProductItemItem from '../components/ProductItem/ProductItemItem';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function ProductItem() {
  const { productId } = useParams<{ productId: string }>();
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [newProductItems, setNewProductItems] = useState<IProductItem[]>([]);
  const [productItems, setProductItems] = useState<IProductItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] = useState<HttpResponsePagination<IProductItem> | null>(
    null,
  );
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    useLayoutStore.setState({
      onCreate: () => {
        const currentTime = new Date().toISOString();
        const currentDate = new Date(currentTime);
        setNewProductItems((prev) => [
          {
            _id: currentDate.toString(),
            isOpen: false,
            name: '',
            price: 0,
            imageUrl: '',
            providers: [
              {
                id: '',
                variantId: '',
                providerId: '',
                isOpen: true,
                name: '',
                price: 0,
                quantity: 0,
              },
            ],
            expirationDays: 1,
            createdAt: currentDate,
            updatedAt: currentDate,
            imagesWarningUrl: [],
            isDiscount: false,
            discount: 0,
            productId: productId!,
            sortOrder: productItems.length + newProductItems.length + 1,
          },
          ...prev,
        ]);
      },
    });
  }, [productId, productItems, newProductItems]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/product-items?page=${page}&perPage=${PER_PAGE}&productId=${productId || ''}`,
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
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await axiosInstance.get<IProduct>(
            `/products/${productId}`,
          );
          setTitle(response.data?.name);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    fetchProduct();
  }, [setTitle, productId]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setProductItems(data.data);
      } else {
        setProductItems((prevProductItems) => [
          ...prevProductItems,
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
        `/product-items?page=${page}&perPage=${PER_PAGE}&productId=${productId || ''}`,
      );
      setData(response.data);
      setProductItems(response.data.data);
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

  const refreshDataWithNewProductItems = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/product-items?page=1&perPage=${PER_PAGE}&search=${search}`,
      );
      setData(response.data);
      setProductItems(response.data.data);
      setNewProductItems((prev) =>
        prev.filter((productItem) => productItem._id !== id),
      );
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
        dataLength={productItems.length}
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
          {newProductItems.map((productItem) => (
            <div key={productItem._id} className="col-md-6 col-12">
              <ProductItemItem
                initialValues={productItem}
                mutate={() => refreshDataWithNewProductItems(productItem._id)}
                onDelete={() => {
                  setNewProductItems((prev) =>
                    prev.filter(
                      (newProductItem) =>
                        newProductItem._id !== productItem._id,
                    ),
                  );
                }}
              />
            </div>
          ))}
          {productItems.map((productItem) => (
            <div key={productItem._id} className="col-md-6 col-12">
              <ProductItemItem
                initialValues={productItem}
                mutate={refreshData}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ProductItem;
