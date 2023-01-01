import { createResource, createSignal, Component, Show } from "solid-js";
import { useParams } from "@solidjs/router";

import { RiSystemAddFill } from "solid-icons/ri";
import { RiSystemDeleteBin5Line } from "solid-icons/ri";

import commands from "../../commands/";
import Loading from "../../lib/Loading";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { notificationsApi } from "../../lib/notifications/Notifications";
import { errorMessage } from "../../commands/";

const Users: Component = () => {
  const params = useParams();
  const [_state, { scheduleError, scheduleSuccess, scheduleWarning }] =
    notificationsApi();
  const fetchUsers = async () => {
    try {
      return await commands.users.listUsers({
        tenantName: params.tenant,
        start: 0,
        count: 10,
      });
    } catch (e) {
      scheduleError(errorMessage(e));
      return [];
    }
  };

  const [users, { refetch }] = createResource(fetchUsers);

  return (
    <>
      <div class="content">
        <Show when={!users.loading} keyed={true} fallback={<Loading />}>
          {() => {
            const values = users().map((x) => x.username);
            return (
              <Table
                columns={[
                  {
                    title: "Username",
                    values,
                  },
                ]}
              />
            );
          }}
        </Show>
      </div>
    </>
  );
};

export default Users;
