-- ── PROFILES ──────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── PROPERTIES ────────────────────────────────────────────────────────────────
CREATE POLICY "properties_select_active" ON properties FOR SELECT
  USING (status = 'active' OR agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent','admin')));

CREATE POLICY "properties_insert_agent" ON properties FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent','admin')));

CREATE POLICY "properties_update_agent" ON properties FOR UPDATE
  USING (agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "properties_delete_agent" ON properties FOR DELETE
  USING (agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── FAVORITES ─────────────────────────────────────────────────────────────────
CREATE POLICY "favorites_own" ON favorites USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ── VISITS ────────────────────────────────────────────────────────────────────
CREATE POLICY "visits_select" ON visits FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = agent_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "visits_insert" ON visits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "visits_update_agent" ON visits FOR UPDATE
  USING (auth.uid() = agent_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ── MESSAGES ──────────────────────────────────────────────────────────────────
CREATE POLICY "messages_select" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_own" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ── PAYMENTS ──────────────────────────────────────────────────────────────────
CREATE POLICY "payments_own" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_admin" ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── DOCUMENTS ─────────────────────────────────────────────────────────────────
CREATE POLICY "documents_own" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON documents FOR UPDATE USING (auth.uid() = user_id);
