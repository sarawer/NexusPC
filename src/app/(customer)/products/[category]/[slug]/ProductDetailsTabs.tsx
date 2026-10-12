'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { ApiError, apiFetch } from '@/lib/api';
import { notify } from '@/components/ui/toast';

interface Review {
  id: number;
  productId: number;
  productName: string;
  author: string;
  rating: number;
  comment: string;
  status: string;
  verified: boolean;
  createdAt: string;
}

interface ProductDetailsTabsProps {
  slug: string;
  productName: string;
  specifications: { label: string; value: string }[];
  description: string;
  reviewCount: number;
}

type Tab = 'specifications' | 'description' | 'reviews';

export default function ProductDetailsTabs({ slug, productName, specifications, description, reviewCount }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('specifications');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    let active = true;
    apiFetch<Review[]>(`/products/${encodeURIComponent(slug)}/reviews`)
      .then((result) => { if (active) setReviews(result); })
      .catch(() => { if (active) notify.error('Could not load product reviews.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    try {
      const review = await apiFetch<Review>(`/products/${encodeURIComponent(slug)}/reviews`, {
        method: 'POST', body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      setReviews((current) => [review, ...current.filter((existing) => existing.id !== review.id)]);
      setHasSubmitted(true);
      setSubmitMessage('Your latest review is visible to everyone. Submit again anytime to replace it.');
      notify.success(hasSubmitted ? 'Review updated' : 'Review posted', `Your review for ${productName} is now visible.`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        notify.info('Please sign in to write a review.');
      } else {
        notify.error(error instanceof Error ? error.message : 'Could not submit your review.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const count = Math.max(reviewCount, reviews.length);

  return (
    <div className="container-site mt-16">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="scrollbar-hide flex flex-nowrap overflow-x-auto border-b border-gray-200 bg-slate-50" role="tablist" aria-label="Product details">
          {([
            ['specifications', 'Specifications'],
            ['description', 'Description'],
            ['reviews', `Reviews (${count})`],
          ] as const).map(([tab, label]) => (
            <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}
              className={`flex-none whitespace-nowrap border-t-2 px-5 py-4 text-sm font-semibold transition-colors sm:px-8 sm:text-base ${activeTab === tab ? 'border-t-blue-600 bg-white text-blue-700' : 'border-t-transparent text-gray-600 hover:bg-white hover:text-gray-900'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 lg:p-10" role="tabpanel">
          {activeTab === 'specifications' && (
            <div className="max-w-4xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Technical Specifications</h2>
              {specifications.length ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <tbody>{specifications.map((spec, index) => (
                      <tr key={`${spec.label}-${index}`} className="border-b border-gray-200 last:border-0 hover:bg-slate-50">
                        <th scope="row" className="w-1/3 border-r border-gray-200 bg-slate-50/50 px-4 py-4 text-left font-semibold text-gray-700 sm:px-6">{spec.label}</th>
                        <td className="w-2/3 px-4 py-4 text-gray-900 sm:px-6">{spec.value}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : <p className="text-gray-500">No specifications provided.</p>}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="prose prose-slate max-w-4xl leading-relaxed text-gray-600">
              <h2 className="text-xl font-bold text-gray-900">About {productName}</h2>
              <p className="whitespace-pre-line">{description || 'No description provided.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
              <section aria-labelledby="customer-reviews-heading">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 id="customer-reviews-heading" className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                    <p className="mt-1 text-sm text-gray-500">{count} {count === 1 ? 'review' : 'reviews'} for this product</p>
                  </div>
                </div>
                {loading ? <p className="py-8 text-sm text-gray-500">Loading reviews…</p> : reviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-slate-50 px-5 py-10 text-center">
                    <Star className="mx-auto mb-3 text-amber-400" size={24} />
                    <p className="font-semibold text-gray-800">No reviews yet</p>
                    <p className="mt-1 text-sm text-gray-500">Be the first to share your experience.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <article key={review.id} className="rounded-xl border border-gray-200 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <time className="text-xs text-gray-500" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
                        </div>
                        <div className="mt-2 flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                          {Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} className={index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />)}
                          {review.verified && <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Verified purchase</span>}
                        </div>
                        <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-gray-700">{review.comment}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="h-fit rounded-xl border border-gray-200 bg-slate-50 p-5 sm:p-6" aria-labelledby="write-review-heading">
                <h2 id="write-review-heading" className="text-lg font-bold text-gray-900">Write a Review</h2>
                <p className="mt-1 text-sm text-gray-500">Share your experience. A new submission replaces your previous review for this product.</p>
                {submitMessage && <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800" role="status">{submitMessage}</div>}
                <form onSubmit={submitReview} className={`${submitMessage ? 'mt-4' : 'mt-5'} space-y-4`}>
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium text-gray-700">Your rating</legend>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, index) => {
                        const value = index + 1;
                        return <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value > 1 ? 's' : ''}`} aria-pressed={rating === value} className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Star size={24} className={value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} /></button>;
                      })}
                    </div>
                  </fieldset>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="review-comment">Your review
                    <textarea id="review-comment" required maxLength={2000} rows={5} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What did you think about this product?" className="input-base mt-2 min-h-32 w-full resize-y" />
                  </label>
                  <p className="text-right text-xs text-gray-500">{comment.length}/2000</p>
                  <button type="submit" disabled={submitting || !comment.trim()} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Saving review…' : hasSubmitted ? 'Update Review' : 'Submit Review'}</button>
                  <p className="text-xs text-gray-500">You need to <Link href="/login" className="font-medium text-blue-600 hover:underline">sign in</Link> to post a review. You can update your review anytime.</p>
                </form>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
