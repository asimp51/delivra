'use client';
import { Star, MessageSquare } from 'lucide-react';

const reviews = [
  { id: '1', customer: 'Ahmed Khan', rating: 5, comment: 'Best chicken in the city! Always fresh and crispy. Delivery was fast too.', date: '2 hours ago', order: 'DLV-A8F2C', replied: false },
  { id: '2', customer: 'Sarah Ali', rating: 4, comment: 'Great food, slightly late delivery but the taste made up for it.', date: '5 hours ago', order: 'DLV-B3D1E', replied: true, reply: 'Thank you Sarah! We are working on faster deliveries.' },
  { id: '3', customer: 'Omar Hassan', rating: 5, comment: 'The family bucket is amazing value. Will definitely order again!', date: '1 day ago', order: 'DLV-C7A9F', replied: false },
  { id: '4', customer: 'Fatima Noor', rating: 3, comment: 'Food was good but the garlic bread was cold when it arrived.', date: '2 days ago', order: 'DLV-D2E8B', replied: true, reply: 'We apologize for the experience Fatima. We have improved our packaging.' },
  { id: '5', customer: 'Khalid Saeed', rating: 5, comment: 'Perfect as always. The cheese burger is my absolute favorite!', date: '3 days ago', order: 'DLV-E1F4A', replied: false },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= count ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Reviews</h1>
          <p className="text-slate-500 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="card px-6 py-4 flex items-center gap-3">
          <span className="text-3xl font-bold text-slate-900">{avgRating}</span>
          <div>
            <Stars count={Math.round(Number(avgRating))} />
            <p className="text-xs text-slate-500 mt-1">{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                  {review.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.customer}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars count={review.rating} />
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-primary-600 font-medium">{review.order}</span>
            </div>

            <p className="text-sm text-slate-700 mb-3">{review.comment}</p>

            {review.replied && review.reply && (
              <div className="bg-primary-50 rounded-lg p-3 ml-6 border-l-3 border-primary-500">
                <p className="text-xs font-semibold text-primary-700 mb-1">Your Reply</p>
                <p className="text-sm text-primary-800">{review.reply}</p>
              </div>
            )}

            {!review.replied && (
              <button className="flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:underline mt-2">
                <MessageSquare className="w-4 h-4" /> Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
