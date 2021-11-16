# Mementor

# TODO
- [ ] Tests UI & API
- [ ] Automate database migration/creation
- [ ] Docker scripts
- [ ] CI/CD workflows
- [ ] Add Upload meme feature (visible only for authorized GitHub users)
- [ ] Add User favorites meme feature (private saved on database for each logged user and public on browser local storage)
- [ ] Distinct public memes from private ones (visible only for authorized GitHub users)
- [ ] Add voting (likes) meme feature with auto-publishing meme
- [ ] Improve search by text performance

### Commit Messages Guidelines

References:
- [Karma’s commit style](http://karma-runner.github.io/0.10/dev/git-commit-msg.html)
- [Semantic Commit Messages Example](https://sparkbox.com/foundry/semantic_commit_messages)

Three projects (scope): 
- api
- core
- scraper

Messages types: 
- feat({project}): {message} => for big features
- refactor({project}): {message} => for refactoring of existing features
- fix({project}): {message} => for bugfixes
- chore({project}): {message} => for no production code changes
- docs({project}): {message} => for docs or README updates
