import { useEffect, useState, useCallback } from 'react';
import type { IProductResponse } from '../types/product';
import { axiosInstance } from '../hooks/useAxios';
import { useLayoutStore } from '../store/useLayoutStore';
import { useParams } from 'react-router-dom';
import ProductUpdateForm from '../components/ProductUpdateForm';

function Product() {
  const { id } = useParams<{ id: string }>();
  const { setTitle, setContent } = useLayoutStore();
  const [product, setProduct] = useState<IProductResponse>();

  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<IProductResponse>(
        `/products/${id}`,
      );
      setProduct(response.data);
      setTitle(response.data?.name);
      setContent(null);
      // setContent(<ProductForm mutate={refreshData} />);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, setTitle, setContent]);

  useEffect(() => {
    if (id) {
      refreshData();
    }
  }, [id, refreshData]);

  if (isLoading) {
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

  return (
    <div className="container">
      <ProductUpdateForm initialValues={product} mutate={refreshData} />
      {/* <div className="row">
        <div className="col">1 of 2</div>
        <div className="col">2 of 2</div>
      </div>
      <div className="row">
        <div className="col">1 of 3</div>
        <div className="col">2 of 3</div>
        <div className="col">3 of 3</div>
      </div> */}
    </div>
  );
}

export default Product;
