 #!/bin/bash
source config.sh
default_timestamp=0
query="mysql -u ${user} -p${password} -P ${port} -h ${host} --column-names=FALSE -e \" select UNIX_TIMESTAMP(datetime_created) from model_payment where to_user_id = ${2-$default_userid} and UNIX_TIMESTAMP(datetime_created) > '${1-$timestamp}' ORDER BY datetime_created DESC LIMIT 0,1 \" venmo "
cd ~/Code/venmo-devops && vagrant ssh -c "$query"
