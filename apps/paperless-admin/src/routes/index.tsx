import { createFileRoute } from "@tanstack/react-router"
import { Label } from "@workspace/ui/components/ui/label"
import { formatRupiah } from "@workspace/utils"
import { GalleryVerticalEnd } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { RichTextEditor } from "@workspace/ui/components/editor/RichTextEditor"

export const Route = createFileRoute("/")({ component: App })

const LARAVEL_EXAMPLE = `<h2>Laravel Image Upload Example</h2>
<p>This example shows how a typical Laravel Blade form with an image input looks when documented in the editor.</p>

<h3>1. Blade Form (resources/views/upload.blade.php)</h3>
<pre><code class="language-html">&lt;form action="{{ route('upload.store') }}" method="POST" enctype="multipart/form-data"&gt;
    @csrf
    &lt;div&gt;
        &lt;label for="title"&gt;Title&lt;/label&gt;
        &lt;input type="text" name="title" id="title" required /&gt;
    &lt;/div&gt;
    &lt;div&gt;
        &lt;label for="image"&gt;Upload Image&lt;/label&gt;
        &lt;input type="file" name="image" id="image" accept="image/*" /&gt;
    &lt;/div&gt;
    &lt;button type="submit"&gt;Upload&lt;/button&gt;
&lt;/form&gt;</code></pre>

<h3>2. Controller (app/Http/Controllers/UploadController.php)</h3>
<pre><code class="language-php">public function store(Request $request)
{
    $request-&gt;validate([
        'title' =&gt; 'required|string|max:255',
        'image' =&gt; 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $imagePath = $request-&gt;file('image')-&gt;store('uploads', 'public');

    Post::create([
        'title' =&gt; $request-&gt;title,
        'image' =&gt; $imagePath,
    ]);

    return redirect()-&gt;back()-&gt;with('success', 'Image uploaded!');
}</code></pre>

<h3>3. Migration Field Reference</h3>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>title</td>
      <td>string</td>
      <td>Post or item title</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>image</td>
      <td>string</td>
      <td>Path stored via Storage facade</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>alt_text</td>
      <td>string</td>
      <td>Accessibility alt attribute</td>
      <td>No</td>
    </tr>
    <tr>
      <td>disk</td>
      <td>string</td>
      <td>Storage disk (public / s3)</td>
      <td>No</td>
    </tr>
  </tbody>
</table>

<h3>4. Displaying the Image in Blade</h3>
<pre><code class="language-html">&lt;img src="{{ Storage::url($post-&gt;image) }}" alt="{{ $post-&gt;title }}" /&gt;</code></pre>

<blockquote>Tip: Always validate MIME types on the server side — never trust the client-side <code>accept</code> attribute alone.</blockquote>

<h3>Key Points</h3>
<ul>
  <li>The form must include <strong>enctype="multipart/form-data"</strong> for file uploads to work</li>
  <li>Use <strong>$request-&gt;file('image')-&gt;store()</strong> to save to the configured disk</li>
  <li>Run <strong>php artisan storage:link</strong> to make the <code>public</code> disk web-accessible</li>
  <li>For S3, set the <code>disk</code> parameter to <code>'s3'</code> and configure your <code>.env</code></li>
</ul>`

function App() {
  const { control } = useForm()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">
          Content <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <RichTextEditor
                initialContent={LARAVEL_EXAMPLE}
                value={field.value}
                onChange={field.onChange}
                hasError={fieldState.invalid}
                placeholder="Write your post content..."
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  )
}
