/**
 * Editions, Objects & Oddities Section
 * Product gallery for limited editions, merchandise, and unique objects
 */

import ProductCard from './ProductCard';
import { products } from '../config/productConfig';
import './Shop.css';

export default function Shop() {
  return (
    <section id="emporium" className="shop">
      <div className="container">
        <h2>THE EMPORIUM</h2>
        <p className="section-subtitle">
          Limited releases, unique objects, and bespoke commissions
        </p>

        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-products">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>

        <div className="editions-note">
          <p>
            All works are limited editions or bespoke commissions. 
            Inquire for availability and details.
          </p>
        </div>
      </div>
    </section>
  );
}
