# Node-cli-project
Simple key-value transactional store CLI application

## Usage
1. Clone repo: `git clone [repo_url]`
2. Navigate to project folder: `cd Node-cli-project`
3. Run application: `node .`


To install globally, navigate to project folder then: `node install -g`. This will allow you to use the `key-value-store` command anywhere to access the application.

## Thoughts and improvements 


### Transaction methods
1. Transactions are copies of the workingStore with changes made. Rolling back pops them off the transaction array and commiting updates the store to the most recent transaction.  This also clears the transaction array.
Pros: Its easy, it works very well
Cons: Requires the most storage, not very scalable. If transactions don't clear after a commit, all existing transactions would have to be updated off the new store.

2. Transactions are objects that only hold changes made during transaction.  Rolling back pops them off the transaction array and committing uses Object.assign(store, transactionObject).
Pros: Much more scalable, since it's only holding updates and not the entire store.  Doesn't require all transactions to be updated in the case that transactions should not clear on commit
Cons: If key/values are DELETED, Object.assign would not account for this. (Possible fix: in a transaction, store deleted keys separately, then delete after COMMIT) 

###Improvements
Use a Store and Error classes instead of series of functions in a single file.

- Doesn't seem necessary for scope of project
