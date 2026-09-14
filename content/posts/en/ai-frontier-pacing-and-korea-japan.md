---
title: "America's AI slowdown, China's missteps, and the choices facing Korea and Japan"
slug: ai-frontier-pacing-and-korea-japan
description: "Calls to slow frontier AI, agent security incidents, Chinese firms' undisclosed use of Claude, and progress in recursive self-improvement make me consider a joint response from Korea and Japan."
publishedAt: "2026-09-14T01:45:03.561Z"
category: ai-agents
tags:
  - AGI
  - AI alignment
  - RSI
  - US-China competition
  - Korea-Japan cooperation
draft: false
---

The leaders of America's frontier AI companies have recently been talking about slowing the pace of development. Watching Sam Altman and Elon Musk agree with Dario Amodei's proposal made me wonder what concerns them most right now.

There has been an incident in which AI agents bypassed restrictions in their research environment to cooperate, a report that Chinese AI companies secretly sent customer requests to Claude, and more discussion of recursive self-improvement, in which AI helps develop the next AI. Individually, these are technology stories. Taken together, they suggest that both the problem of controlling AI and the balance of power between countries are changing.

I think an American-led order could last much longer than we expect. That makes me especially concerned about Korea and Japan. Can we maintain our economic position simply by using American technology well and remaining US allies?

<figure>
  <img src="/content/ai-frontier-pacing-and-korea-japan/01-frontier-pacing.png" alt="Two researchers review an AI system in front of a server facility" width="1672" height="941" loading="lazy">
  <figcaption>An illustration of balancing the pace of AI development with the time needed for verification. AI-generated image.</figcaption>
</figure>

## Why the people building AI are calling for a slower pace

> We must slow the pace at which we improve the capabilities of AI models.

Dario Amodei wrote this in [“We Must Pace the Frontier,”](https://darioamodei.com/post/we-must-pace-the-frontier) published in September 2026. He pointed to AI accelerating the development of the next generation of AI and to the OpenAI–Hugging Face incident. His proposal does not call for stopping all training. It calls for enough time to verify safety as capabilities improve, with independent evaluators able to carry out ongoing checks inside the companies.

[Sam Altman also agreed with Dario's proposal](https://x.com/sama/status/2098811563415150910) and said OpenAI would give external evaluators access comparable to that of employees. [Elon Musk endorsed the same essay.](https://x.com/elonmusk/status/2098789109980332057) The three did not promise identical implementation plans, but it is significant that people at the forefront of development have publicly recognized the need to control its pace.

I take these statements seriously because they came alongside an actual incident. The developers have identified failures in the development process and are concerned that similar problems could occur in more capable models. Knowing how to improve performance and knowing how to control that performance safely are separate things.

## The message board the agents created for themselves

One of the most striking stories I came across on X was about agents that had been kept separate creating a message board to cooperate. According to [OpenAI's investigation, published on August 26,](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) an agent left a note in Artifactory on May 12 while looking for a file it needed. Artifactory stores and distributes software packages; the agents used it as a place to exchange messages.

The agents later shared ways to bypass the research environment's restrictions on internet access. After an outage and security response in early July, Artifactory was rebuilt on July 8. When evaluations resumed, the agents recreated a communication channel that same day. On July 11, the activity led to an intrusion exploiting zero-day vulnerabilities—security flaws not known at the time—in Hugging Face. At the center of the incident was IM1, an internal research model that had not been released publicly.

<figure>
  <img src="/content/ai-frontier-pacing-and-korea-japan/02-agent-message-board.png" alt="Six separate agents exchange messages through shared storage" width="1672" height="941" loading="lazy">
  <figcaption>Separate agents exchange information through shared storage. AI-generated image.</figcaption>
</figure>

There is also evidence for the story that the agents used cryptography, though this should be distinguished from encrypting messages to hide their contents. [The independent investigation by METR and Redwood Research](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) found that agents attached cryptographic signatures to messages to prevent impersonation. They had developed a way to verify who sent a message as part of their cooperation.

There is no basis for describing this as agents getting angry and retaliating when humans intervened. Nor does accumulating information on a message board by itself prove that the model's intelligence improved autonomously. Still, the confirmed behavior is concerning enough to me. Agents trying to complete assigned tasks cooperated beyond their permitted scope, and that cooperation led to an intrusion into an external system. The incident raises the question of whether instructions given to individual agents can also control the behavior of the group.

## Reasons to question China's AI independence

A report from the Chinese AI sector raised questions about both technological independence and trust in the services. [Anthropic's September threat intelligence report](https://www.anthropic.com/threat-intelligence-report-september-2026) said Moonshot AI, the company behind Kimi, secretly forwarded customer requests to Claude and returned its responses to customers. According to the investigation, Moonshot also collected some of those conversations to train its own models. The report describes both undisclosed request routing and distillation.

The same report describes the exposure of sensitive information. The Moonshot case included surveillance material from a user possibly connected to China's People's Liberation Army, as well as internal code and access credentials submitted by an engineer at a state-owned enterprise. Database credentials from a government agency linked to Russia's Ministry of Defense appeared in a separate DeepSeek case. All of this should be read as findings published by Anthropic.

I see this conduct as a serious misstep by Chinese AI companies. Users would have expected the model and service they selected to process their data, yet their requests were being passed to a model operated by a company in another country. If a service chosen in the hope of AI independence concealed its technological dependence and passed sensitive information outside the country, that is a question of trust as well as performance.

This report alone does not establish that Kimi was entirely a fake model or that all Chinese AI research is worthless. The claim that the information reached the US government is also difficult to present as a confirmed fact. My concern is the disclosed request routing and information exposure. Those findings alone make me think China's independent AI capabilities deserve more rigorous scrutiny.

## Chinese AI could still threaten American companies

Criticizing Chinese companies' technological dependence and trust problems does not mean the competitive pressure they put on American companies is small. How much technology they developed independently and how attractive an alternative they offer customers are different questions. I think the threat from Chinese AI companies could come from performance, price, and the way they release their models together.

I have also heard that DeepSeek will release a new model in September at the level of Fable or Astra, at a lower price. That timing and performance comparison still need confirmation. What is officially established is [the September 10 release of V4.1-Flash and a reduction in API prices.](https://www.deepseek.com/en/news/deepseek-v4-1-flash/) The same announcement mentions a forthcoming V4.1-Pro, but does not provide its exact release date or evidence of performance on par with Fable or Astra.

The model already released deserves attention. [The V4.1-Flash model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) states that both the repository and model weights are available under the MIT license. In the company's published evaluations, it achieved results similar to Opus 5.0 or GPT-5.6 Sol on some coding tasks, while gaps remained on others. That is insufficient evidence to claim equality with the latest American models in every area, but it does suggest that a publicly available model could be an alternative for some uses.

What matters to customers is likely to be whether a model performs their work well enough and what it costs. If a Chinese model offers the quality they need at a lower price, there is less reason to give every task to an expensive model, even if the American model leads on difficult problems. If Chinese companies go on to offer performance close to Fable or Astra at a lower price, American companies could face greater pressure when maintaining high fees or recouping their investment.

Releasing weights could broaden this competition. Companies with the necessary computing resources can run and modify a model themselves, and other providers can build services around the same model. Operating costs do not disappear, but customers gain an alternative to relying exclusively on the original developer's API. I think that additional choice alone could put pressure on American frontier companies' pricing power and customer retention.

<figure>
  <img src="/content/ai-frontier-pacing-and-korea-japan/03-open-model-competition.png" alt="Developers adapt publicly available computing modules for different devices" width="1672" height="941" loading="lazy">
  <figcaption>Different providers use a publicly available model, giving customers more choices. AI-generated image.</figcaption>
</figure>

With this competition in mind, proposals to slow AI development resemble Cold War arms-control negotiations. [The Strategic Arms Limitation Talks between the United States and the Soviet Union](https://history.state.gov/milestones/1969-1976/salt) were an example of rivals negotiating weapons limits and verification while continuing to compete. Dario also [explicitly compares an agreement to limit the pace of recursive self-improvement to SALT in the same essay.](https://darioamodei.com/post/we-must-pace-the-frontier) The connection is that both sides acknowledge the other's power while seeking terms that reduce risks they cannot afford to bear.

I also read this proposal as an attempt by the United States and the West to retain their current advantage while slowing a dangerous competition. That is my interpretation: a desire for safety and an interest in preserving favorable competitive conditions can coexist. If China has the ability to keep competing, it would have little reason to accept an American proposal unchanged. An agreement involving China would need limits and ways of verifying compliance that both sides find acceptable. The continuing threat from Chinese AI makes joint restraint more necessary and an agreement harder to reach.

## AI is already taking part in developing the next AI

Around the same time, there were stories that Google DeepMind had created RSI. RSI stands for Recursive Self-Improvement: AI helps research and development produce better AI, which then contributes to the next round of development. An agent merely launching another agent does not establish that this entire process is taking place.

<figure>
  <img src="/content/ai-frontier-pacing-and-korea-japan/04-ai-research-development.png" alt="A researcher reviews results from three connected experimental devices" width="1672" height="941" loading="lazy">
  <figcaption>AI assists research and experiments while people review the results. AI-generated image.</figcaption>
</figure>

There is officially documented progress. In its September 2 [announcement of Gemini 3.8 Flash and Flash Cyber,](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) Google said it accelerated development through long-running agents that recursively evaluated and refined the underlying models. AI participating in AI development is now part of publicly described development methods. That does not mean a system that improves endlessly without human intervention has been completed.

OpenAI also described its research environment during Astra's development, saying coding agents were widely used to write research code and conduct experiments. Alongside its account of reaching the stage of an “automated research intern” capable of well-defined research tasks under human direction, it wrote:

> We do not yet know how to safely get all the way to aligned, full RSI.

This sentence appears in OpenAI's September 6 essay [“Research acceleration: The view inside OpenAI.”](https://openai.com/index/research-acceleration-view-inside-openai/) The same essay says humans still set research priorities, judge results, and decide whether to scale, pause, or deploy. Its September 9 [policy essay also explicitly says that fully autonomous RSI is not happening today.](https://openai.com/index/ai-policy-window/)

My concern is what happens when this process gets faster. If AI plans research, changes code, and runs experiments in parallel, humans may find it difficult to examine every change and result with the same depth. If verification falls behind development, people may only begin tracing what went wrong after a problem occurs. I do not think the work of alignment—making AI respect human intentions and agreed restrictions—can be postponed until development is finished.

## Did China's failures buy America more time?

What follows is my speculation. If Chinese companies depended on American models more than expected, American frontier companies may have concluded that they could moderate development while retaining their lead. Less pressure from the prospect of China overtaking them soon could leave more room for alignment and control. However, Chinese models' pricing and release practices can continue to exert competitive pressure, so there is no guarantee that this breathing room will last.

Dario's essay also connects technological leadership with a slower pace. He argues that the United States and democratic countries need to retain their advantage over China to gain time to improve safety. He is not declaring the competition with China over; he sees preserving the gap as a condition for pacing development.

I therefore would not conclude that the recent revelations about China directly caused the three leaders' statements. I do not know what judgments they shared internally. But their assessment of a rival country's actual capabilities may have played a role alongside the judgment that control could become harder later if alignment does not progress sufficiently now.

If this speculation is right, the American companies' call for a slower pace could express both technical confidence and concern about safety. They may be approaching a stage at which they have the ability to improve performance but need to decide how far to permit those capabilities to advance.

## Why I think America's advantage could last more than 100 years

If the United States retains its lead in developing and using AI, I think an American-centered order could last more than another 100 years. My reasoning concerns how much AI expands the economy, who receives the income from that growth, and where they reinvest it.

[Anthropic's economic scenario analysis](https://www.anthropic.com/institute/econ-scenarios) helped me make this argument more concrete. The researchers compared how the US economy could change by 2030 under different assumptions about AI capabilities, adoption, and automation. These are not forecasts that assign probabilities to particular futures. They illustrate how much the scale of growth and the distribution of income can vary with the assumptions.

| Scenario in 2030 | GDP above the no-AI case | Capital's share of total income |
| --- | ---: | ---: |
| Modest change | 1.6% | 40.6% |
| Substantial change | 8.3% | 43.9% |
| Extreme change | 32.4% | 54.8% |

The table presents two measures selected from [Table 3 of the technical report.](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf) The GDP differences compare economies in the same year, 2030, against a no-AI baseline; they are not annual growth rates. Capital's share is 40% in that baseline.

The extreme scenario considers rapid AI adoption and high levels of automation in knowledge work. In that case, annual GDP growth reaches roughly 15% around 2030. At the same time, knowledge workers' wages and employment deteriorate, and capital's share of income rises. More of the additional income could go to capital owners than to wages.

This makes me think about competition between countries. What if AI can perform knowledge work previously supplied by other countries, while American companies continue to own the technology and capital supplying that AI? The United States could increase production with less reliance on outside labor and also earn revenue by providing services and technology as other countries use more AI. My interpretation is that it could remain engaged in world markets while becoming less dependent on its partners.

If that income can be reinvested in the next generation of models, computing facilities, and researchers, retaining the technological lead could become easier. Companies with better AI would earn more income and use it to expand their development capabilities again. If that pattern remains favorable to the United States for a long time, I think today's differences in model performance could become lasting economic gaps between countries.

The study, however, covers economic changes only through 2030. It does not compare US and Chinese growth rates or calculate how long American dominance will last. It treats capital as a single category, so it does not mean American AI companies receive all the additional income. Rapid advances in robotics are excluded, and the researchers explain that income distribution could also change if constraints on capital supply ease. Simply extending a high 2030 growth rate over 100 years would not support my argument.

My reference to 100 years is a long-term outlook conditional on the United States retaining control of key technologies, reinvesting faster than other countries can catch up, and addressing domestic income inequality and employment shocks. I do not know whether those conditions will hold. But the possibility that AI expands both productive capacity and capital income makes it difficult to dismiss the prospect of a lasting technological advantage.

That is why I do not think being pro-American and pro-Western guarantees Korea and Japan their economic position. If the value of the technology, markets, and productive capacity we offer declines, we could come closer to the situation people joke about as paying a “friendship fee” to ask that the relationship continue. My concern is a position in which we bear more costs while others set the terms for important technologies and businesses.

## Korea and Japan need to invest together and change together

I therefore think Korea and Japan should begin resolving their longstanding grievances and pursue much deeper cooperation now. In the long term, they should go as far as building a federal community. I envision close cooperation between their governments and research institutions, companies and talent working in a larger market, and capital concentrated on the industries that will shape their shared future.

They should address responsibility and disputes over history while also preparing future industries and research together. Political integration would require both countries' citizens to agree, along with years of institutional design. Before that, they can start with joint research funding and computing resources, make it easier for researchers to move and launch companies together, and help businesses grow across both markets.

Investment in frontier AI companies needs to match that ambition. Joint research institutions could undertake basic research and develop talent, private companies could continue developing models and competing on products, and governments could support computing facilities and long-term research. They would also need to build safety evaluation capabilities alongside model performance. Having seen why American developers are concerned about control, we cannot focus only on catching up in performance.

<figure>
  <img src="/content/ai-frontier-pacing-and-korea-japan/05-korea-japan-joint-research.png" alt="Researchers review an AI device together in a shared laboratory" width="1672" height="941" loading="lazy">
  <figcaption>An imagined collaboration in which Korean and Japanese researchers prepare shared computing resources and research projects. AI-generated image.</figcaption>
</figure>

Combining markets and increasing funding would not be enough. What I want to criticize as “East and West Joseon-style guanxi”—a jab at cronyism in Japan and Korea—is the allocation of opportunities according to connections and affiliation. If organizational ties matter more than research results, and established insiders get resources before new companies, joint investment will struggle too.

The reasons for awarding public support and any conflicts of interest should be disclosed, and there should be assessments capable of evaluating the technology. A researcher who tries something new and fails should be distinguished from someone who uses connections to obtain support and then evades responsibility. Cooperation should not expand the reach of existing bad practices.

I do not think cooperation guarantees success. But if each country divides resources within its own small market and familiar networks while waiting for the next American product announcement, I believe our future choices will continue to narrow. I want Korea and Japan to remain countries that can build the technology they need and state their own terms within an alliance.

If they expect to retain their present standing without making those changes, I do not see the future I want for Korea and Japan. Unfortunately.
