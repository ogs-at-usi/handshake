## GitHub structure
The **main branch** will only feature the weekly releases of the project. The main branch is protected. We don't want to take any risk!

When working on each feature, we will push on a specific **feature branch**.
The finished feature will then be merged in the **development branch** through a pull request. The development branch protected as well: a pull request must be approved before it can be merged.

Once all the weekly features are merged on the development branch and all the bugs are fixed, we merge it on a **release branch**, one for each milestone.

After each release is ready, we can finally merge it on the main branch. Every step has to be checked and approved of course!
