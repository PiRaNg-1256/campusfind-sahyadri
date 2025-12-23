CREATE POLICY "Users can delete own items images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'items' AND auth.uid() = owner );