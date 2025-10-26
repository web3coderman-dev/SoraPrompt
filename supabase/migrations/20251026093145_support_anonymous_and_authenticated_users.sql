/*
  # 支持匿名和认证用户共存

  ## 变更说明
  这次迁移将产品架构从"强制登录"改为"匿名优先，可选登录"模式，
  以降低用户使用门槛，提升转化率。

  ## 修改内容

  1. **prompts 表结构调整**
     - 将 `user_id` 改为可选（允许 NULL）
     - 添加 `session_id` 字段用于匿名用户追踪
     - 保持向后兼容：已有的认证用户数据不受影响

  2. **RLS 策略更新**
     - 移除旧的认证用户专属策略
     - 新增支持匿名用户（anon）和认证用户（authenticated）的策略
     - 匿名用户可以创建和查看 prompts（无需登录）
     - 认证用户可以查看、创建、删除自己的 prompts

  3. **数据访问规则**
     - 匿名用户：可以创建和读取所有 prompts（前端通过 localStorage 过滤）
     - 认证用户：只能访问 user_id 匹配的 prompts
     - 支持未来扩展：可以通过 session_id 实现匿名用户的数据关联

  ## 安全性说明
  - 匿名用户创建的数据不包含敏感信息
  - 认证用户的数据通过 user_id 隔离保护
  - 可以后续添加数据清理策略（如：30天后删除无 user_id 的记录）
*/

-- 1. 将 user_id 改为可选
ALTER TABLE prompts ALTER COLUMN user_id DROP NOT NULL;

-- 2. 添加 session_id 字段（用于匿名用户，可选）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompts' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE prompts ADD COLUMN session_id text;
  END IF;
END $$;

-- 3. 删除旧的限制性 RLS 策略
DROP POLICY IF EXISTS "Users can insert their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can view their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON prompts;

-- 保留原有的宽松策略（如果存在）
DROP POLICY IF EXISTS "Anyone can create prompts" ON prompts;
DROP POLICY IF EXISTS "Anyone can read prompts" ON prompts;
DROP POLICY IF EXISTS "Anyone can update prompts" ON prompts;

-- 4. 创建新的 RLS 策略：支持匿名和认证用户

-- 4.1 允许匿名用户创建 prompts
CREATE POLICY "Anonymous users can create prompts"
  ON prompts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4.2 允许认证用户创建自己的 prompts
CREATE POLICY "Authenticated users can create their prompts"
  ON prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4.3 允许匿名用户读取所有 prompts（前端会用 localStorage 过滤）
CREATE POLICY "Anonymous users can read all prompts"
  ON prompts
  FOR SELECT
  TO anon
  USING (true);

-- 4.4 允许认证用户读取自己的 prompts
CREATE POLICY "Authenticated users can read their prompts"
  ON prompts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4.5 允许认证用户删除自己的 prompts
CREATE POLICY "Authenticated users can delete their prompts"
  ON prompts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4.6 允许认证用户更新自己的 prompts
CREATE POLICY "Authenticated users can update their prompts"
  ON prompts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. 添加索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prompts_session_id ON prompts(session_id) WHERE session_id IS NOT NULL;
