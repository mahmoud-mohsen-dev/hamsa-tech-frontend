import { redirect } from 'next/navigation';

export default function BlogMainPage() {
  // Redirect to the first page of blogs (blog/page/1)
  redirect('/blog/page/1');
  return null; // No need to render anything as it redirects
}
