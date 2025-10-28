import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sceneBackground text-text-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Logo size={48} />
            <h1 className="text-4xl font-bold font-display">服务条款</h1>
          </div>
          <p className="text-text-secondary">最后更新：2025年1月</p>
        </div>

        <div className="space-y-8 bg-sceneFill rounded-2xl p-8 border border-borderSubtle">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. 服务说明</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                SoraPrompt Studio 是一个 AI 驱动的提示词生成工具，旨在帮助用户为 Sora
                视频生成创建专业的提示词。使用本服务即表示您同意遵守这些条款。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. 用户账户</h2>
            <div className="text-text-secondary space-y-3">
              <p>使用本服务时：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>您必须提供准确、完整的注册信息</li>
                <li>您有责任保护账户安全和密码机密性</li>
                <li>您对账户下的所有活动负责</li>
                <li>如发现账户被未经授权使用，请立即通知我们</li>
                <li>每个用户只能注册一个账户</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. 使用规则</h2>
            <div className="text-text-secondary space-y-3">
              <p>使用本服务时，您同意不会：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>违反任何适用的法律法规</li>
                <li>侵犯他人的知识产权或隐私权</li>
                <li>生成非法、有害、威胁、辱骂或淫秽的内容</li>
                <li>试图破坏或干扰服务的正常运行</li>
                <li>使用自动化工具（机器人、爬虫等）滥用服务</li>
                <li>冒充他人或虚假陈述与他人的关系</li>
                <li>上传病毒或恶意代码</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. 内容权利</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                <strong>您的内容：</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>您保留对自己输入内容的所有权利</li>
                <li>您授予我们使用、存储和处理您内容的许可，以提供服务</li>
                <li>您确保拥有必要的权利来使用和分享您的内容</li>
              </ul>
              <p className="mt-3">
                <strong>生成的提示词：</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI 生成的提示词归您所有</li>
                <li>您可以自由使用生成的提示词</li>
                <li>我们可能会使用匿名化的使用数据来改进服务</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. 付费服务</h2>
            <div className="text-text-secondary space-y-3">
              <p>如果您购买付费订阅：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>费用将按照当前的定价计划收取</li>
                <li>订阅会自动续订，除非您取消</li>
                <li>退款政策根据具体情况而定</li>
                <li>我们保留随时更改价格的权利，但会提前通知您</li>
                <li>未付款可能导致服务中断</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. 免费额度</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                免费用户每日享有有限次数的生成配额：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>访客模式：每日 1 次免费生成</li>
                <li>注册用户：每日 3 次免费生成</li>
                <li>额度在每日 00:00 UTC 重置</li>
                <li>未使用的额度不会累积到次日</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. 服务可用性</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                我们努力保持服务的持续可用，但：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>服务按"现状"提供，不提供任何明示或暗示的保证</li>
                <li>我们可能会因维护、升级或其他原因暂停服务</li>
                <li>我们不对服务中断或数据丢失承担责任</li>
                <li>我们保留随时修改或终止服务的权利</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. 第三方服务</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                本服务集成了第三方服务（如 OpenAI、Google、Stripe）。
                使用这些服务时，您也需要遵守其各自的服务条款和隐私政策。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. 免责声明</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                在法律允许的最大范围内：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>我们不对 AI 生成内容的准确性、完整性或适用性负责</li>
                <li>我们不对因使用或无法使用服务造成的损失负责</li>
                <li>我们的总责任不超过您在过去 12 个月内支付的费用</li>
                <li>某些司法管辖区可能不允许排除某些保证或责任限制</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. 账户终止</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                我们保留在以下情况下暂停或终止您账户的权利：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>违反这些服务条款</li>
                <li>提供虚假或误导性信息</li>
                <li>长期不活跃（超过 12 个月）</li>
                <li>涉嫌欺诈或非法活动</li>
              </ul>
              <p className="mt-3">
                您可以随时通过设置页面删除您的账户。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. 条款变更</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                我们可能会不时更新这些条款。重大变更将通过：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>在网站上发布通知</li>
                <li>发送电子邮件通知</li>
                <li>在登录时显示弹窗</li>
              </ul>
              <p className="mt-3">
                变更后继续使用服务即表示您接受新条款。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. 争议解决</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                因本条款引起的任何争议应首先通过友好协商解决。
                如协商不成，双方同意提交至服务提供商所在地的有管辖权的法院解决。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. 其他条款</h2>
            <div className="text-text-secondary space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>完整协议：</strong>这些条款构成您与我们之间关于服务的完整协议
                </li>
                <li>
                  <strong>可分割性：</strong>如果任何条款被认定无效，其余条款仍然有效
                </li>
                <li>
                  <strong>不弃权：</strong>我们未执行某项权利不构成对该权利的放弃
                </li>
                <li>
                  <strong>转让：</strong>未经我们同意，您不得转让本协议下的权利
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. 联系我们</h2>
            <div className="text-text-secondary space-y-3">
              <p>
                如果您对这些条款有任何疑问，请联系我们：
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>邮箱：support@soraprompt.studio</li>
                <li>网站：https://soraprompt.studio</li>
              </ul>
            </div>
          </section>

          <section className="pt-4 border-t border-borderSubtle">
            <p className="text-sm text-text-tertiary">
              使用 SoraPrompt Studio 即表示您已阅读、理解并同意受这些服务条款的约束。
              如果您不同意这些条款，请不要使用我们的服务。
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Button variant="director" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
