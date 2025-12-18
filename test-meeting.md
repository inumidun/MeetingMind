Meeting: TechCorp ERP Cloud Migration - Project Kickoff
Date: December 12, 2025
Attendees: Abolore (PM), Oyindamola (Solutions Architect), Qazeem (DevOps Lead), Jennifer Wu (Security Engineer), David Kim (Network Engineer)

Hey everyone, thanks for joining the call today. So we're here to discuss TechCorp's ERP migration to AWS and how we're going to handle the hybrid connectivity with their on-premises systems. Abolore, you want to kick us off?

Sure, thanks Oyindamola. So TechCorp is running SAP ERP on their data center and they want to move critical workloads to AWS while maintaining connectivity to their legacy systems. They've got about 500 users and need high availability. The timeline is pretty aggressive - they want to go live by March 2025.

That's tight but doable. Qazeem, we'll need you to set up the VPC architecture and VPN connections by next Friday. The network design is critical here since they need low latency between cloud and on-prem. Can you handle the initial AWS infrastructure setup?

Absolutely. I'll start with the VPC design and get the site-to-site VPN configured. Should I also look into Direct Connect for better performance? Their current bandwidth requirements seem pretty high.

Good point. Jennifer, what's your take on the security requirements? They mentioned compliance needs during the pre-sales call.

Yeah, they're in financial services so we need to ensure data encryption in transit and at rest. I'll need to review their current security policies and map them to AWS security groups and NACLs. Also, we should implement AWS Config for compliance monitoring. This is high priority stuff.

David, can you work with Qazeem on the network connectivity? We need to ensure the hybrid setup doesn't create any bottlenecks.

Sure thing. I'll coordinate with their network team to understand the current topology. We might need to implement some routing optimizations. I should have the network assessment done by Monday.

Great. Oyindamola, what about the application migration strategy? Are we doing lift-and-shift or are there modernization opportunities?

I think we start with lift-and-shift for the core ERP modules to meet their timeline, but we should identify components that can be containerized later. I'll create the migration roadmap and identify dependencies. This needs to be ready for the client review next Wednesday.

Perfect. Abolore, can you schedule the follow-up meeting with TechCorp for next Thursday? We need to present our initial architecture and get their sign-off.

Will do. I'll also prepare the project charter and resource allocation plan. We need to get budget approval for the additional Direct Connect circuit if we're going that route.

One more thing - Qazeem, make sure you coordinate with Jennifer on the security groups before deploying anything. We can't afford any security gaps in this setup.

Got it. I'll loop Jennifer in on all the infrastructure changes. Should we also set up monitoring and alerting from day one?

Definitely. Set up CloudWatch and maybe look into third-party monitoring tools they're already using. Integration is key here.

Alright team, sounds like we have our action items. Let's reconvene Monday to check progress. This is a big opportunity for us, so let's make sure we deliver excellence.