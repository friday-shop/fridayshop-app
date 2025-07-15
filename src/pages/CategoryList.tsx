import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ICategory } from '../types/category';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import type { HttpResponsePagination } from '../types/global';
import CategoryItem from '../components/Category/CategoryItem';

const PER_PAGE = Number(import.meta.env.VITE_PER_PAGE) || 5;

function Category() {
  const { search, setTitle } = useLayoutStore();
  const [page, setPage] = useState(1);
  const [newCategories, setNewCategories] = useState<ICategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [data, setData] = useState<HttpResponsePagination<ICategory> | null>(
    null,
  );
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    useLayoutStore.setState({
      onCreate: () => {
        const currentDate = new Date();
        setNewCategories((prev) => [
          {
            _id: currentDate.toString(),
            name: '',
            description: '',
            imageUrl: '',
            isOpen: false,
            isUseForm: false,
            formFormat: '',
            createdAt: currentDate,
            updatedAt: currentDate,
            imagesWarningUrl: [],
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
          `/categories?page=${page}&perPage=${PER_PAGE}&search=${search}`,
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
    setTitle('ประเภทสินค้าที่วางขาย');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setCategories(data.data);
      } else {
        setCategories((prevCategories) => [...prevCategories, ...data.data]);
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
        `/categories?page=${page}&perPage=${PER_PAGE}&search=${search}`,
      );
      setData(response.data);
      setCategories(response.data.data);
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
        dataLength={categories.length}
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
          {newCategories.map((category) => (
            <div key={category._id} className="col-md-6 col-12">
              <CategoryItem
                initialValues={category}
                mutate={refreshData}
                onDelete={() => {
                  setNewCategories((prev) =>
                    prev.filter(
                      (newCategory) => newCategory._id !== category._id,
                    ),
                  );
                }}
              />
            </div>
          ))}
          {categories.map((category) => (
            <div key={category._id} className="col-md-6 col-12">
              <CategoryItem initialValues={category} mutate={refreshData} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Category;
